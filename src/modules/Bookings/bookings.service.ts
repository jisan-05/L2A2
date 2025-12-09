import { pool } from "../../config/db";

const addBookings = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const isAvailable = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [vehicle_id]
  );

  const vehicle = isAvailable.rows[0];

  if (isAvailable.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  if (isAvailable.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const diffDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total_price = diffDays * vehicle.daily_rent_price;

  // 3️⃣ Insert booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings (
       customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
     ) VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  const booking = bookingResult.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getBookings = async (userId?: string) => {
  if (userId) {
    // Customer: get only own bookings
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1`,
      [userId]
    );
    const vehicleId = result.rows[0].vehicle_id;
    const getVehicleInfo = await pool.query(
      `SELECT vehicle_name,registration_number,type FROM vehicles WHERE id=$1`,
      [vehicleId]
    );
    const bookingInfo = result.rows[0];
    const vehicleInfo = getVehicleInfo.rows[0];
    // console.log(bookingInfo);
    // console.log(vehicleInfo);
    return { ...bookingInfo, vehicle: vehicleInfo };
  } else {
    const bookings = await pool.query(`SELECT * FROM bookings`);

    const formatted = [];

    for (const row of bookings.rows) {
      const customer = await pool.query(
        `SELECT name, email FROM users WHERE id=$1`,
        [row.customer_id]
      );

      const vehicle = await pool.query(
        `SELECT vehicle_name, registration_number 
     FROM vehicles WHERE id=$1`,
        [row.vehicle_id]
      );

      formatted.push({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: customer.rows[0],
        vehicle: vehicle.rows[0],
      });
    }

    return formatted;
  }
};

const updateBookings = async (
  bookingId: string,
  role: string,
  request: string
) => {
  // console.log(bookingId,role);
  if (role === "customer") {
    const startDate = await pool.query(
      `SELECT rent_start_date FROM bookings WHERE id=$1`,
      [bookingId]
    );
    const today = new Date();
    const rentStartDate = startDate.rows[0].rent_start_date;
    if (today < rentStartDate) {
      const result = await pool.query(
        `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
        [request, bookingId]
      );
      return result.rows[0];
    }
  }
  if (role === "admin") {
    const updateStatus = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [request, bookingId]
    );
    const bookingsInfo = updateStatus.rows[0];
    const vehicleId = updateStatus.rows[0].vehicle_id;
    // console.log(vehicleId);
    const result = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id= $2
      RETURNING availability_status`,
      ["available", vehicleId]
    );
    const vehicleAvailable = result.rows[0].availability_status;
    // console.log(vehicleAvailable);
    return {
      ...bookingsInfo,
      vehicle: {
        availability_status: vehicleAvailable,
      },
    };
  }
};

export const bookingsServices = {
  addBookings,
  getBookings,
  updateBookings,
};
