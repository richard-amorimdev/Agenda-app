import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsers() {
  try {
    console.log("🔍 Verificando usuários no banco de dados...")

    const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("❌ Erro ao buscar usuários:", error)
      return
    }

    if (!users || users.length === 0) {
      console.log("⚠️  Nenhum usuário encontrado no banco de dados!")
      console.log("💡 Você precisa criar usuários primeiro.")
      return
    }

    console.log(`✅ Encontrados ${users.length} usuário(s):`)
    console.log("=".repeat(80))

    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`)
      console.log(`   Username: "${user.username}"`)
      console.log(`   Nome: "${user.name}"`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Criado em: ${user.created_at}`)
      console.log(`   Password Hash: ${user.password_hash ? "Definido" : "NÃO DEFINIDO"}`)
      console.log("-".repeat(40))
    })

    // Verificar se existe algum admin
    const admins = users.filter((user) => user.role === "admin")
    const consultores = users.filter((user) => user.role === "consultor")

    console.log(`\n📊 Resumo:`)
    console.log(`   Administradores: ${admins.length}`)
    console.log(`   Consultores: ${consultores.length}`)

    if (admins.length > 0) {
      console.log(`\n👑 Administradores encontrados:`)
      admins.forEach((admin) => {
        console.log(`   - Username: "${admin.username}" | Nome: "${admin.name}"`)
      })
    }

    if (consultores.length > 0) {
      console.log(`\n👤 Consultores encontrados:`)
      consultores.forEach((consultor) => {
        console.log(`   - Username: "${consultor.username}" | Nome: "${consultor.name}"`)
      })
    }
  } catch (error) {
    console.error("❌ Erro inesperado:", error)
  }
}

checkUsers()
