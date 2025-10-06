#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌤️  Configurando SkyCast Next.js...\n');

// Crear archivo .env.local si no existe
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  const envContent = `# Meteomatics API Credentials
MET_USER=linogarcia_yenso
MET_PASS=eBCQ7aI6MhpvMg9SCkno

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyArLVHe9xh3ITcIVLz8_ibHpz3w_Oa7HIQ
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado');
} else {
  console.log('ℹ️  Archivo .env.local ya existe');
}

// Crear directorios necesarios
const dirs = ['models', 'outputs'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Directorio ${dir} creado`);
  } else {
    console.log(`ℹ️  Directorio ${dir} ya existe`);
  }
});

console.log('\n🎉 Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Ejecuta: npm install');
console.log('2. Ejecuta: npm run dev');
console.log('3. Visita: http://localhost:3000');
console.log('\n🔧 Variables de entorno configuradas:');
console.log('- MET_USER y MET_PASS para Meteomatics API');
console.log('- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para Google Maps');
console.log('\n📖 Lee el README.md para más información');

