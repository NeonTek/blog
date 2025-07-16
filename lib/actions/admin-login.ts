export async function verifyAdminPassword(password: string): Promise<{ message: string }> {
  const res = await fetch("/api/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.message)

  return data
}
