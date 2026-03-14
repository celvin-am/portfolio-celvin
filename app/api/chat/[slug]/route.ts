import { NextResponse } from "next/server";
import { createClient } from "@/common/utils/server";

// FUNGSI UNTUK MENGAMBIL PESAN (GET)
export const GET = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
};

// FUNGSI UNTUK MENGIRIM PESAN (POST)
export const POST = async (req: Request) => {
  const supabase = createClient();
  try {
    const body = await req.json();
    const { error } = await supabase.from("messages").insert([body]);

    if (error) throw error;

    return NextResponse.json("Message sent successfully", { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};

// FUNGSI UNTUK MENGHAPUS PESAN (DELETE)
export const DELETE = async (
  req: Request,
  { params }: { params: { slug: string } },
) => {
  const supabase = createClient();
  try {
    const id = params.slug;
    await supabase.from("messages").delete().eq("id", id);
    return NextResponse.json("Data deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};