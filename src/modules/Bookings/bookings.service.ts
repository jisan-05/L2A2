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
    const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [
      userId,
    ]);
    return result;
  } else {
    // Admin: get all bookings
    const result = await pool.query(`SELECT * FROM bookings`);
    return result;
  }
};

export const bookingsServices = {
  addBookings,
  getBookings,
};
