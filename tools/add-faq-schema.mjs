/**
 * Script para agregar FAQ Schema a las páginas de servicio.
 * Es idempotente: si una página ya tiene FAQPage, no la toca.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// FAQ por servicio
const FAQS = {
  'fumigacion-residencial-cali.html': [
    {
      question: '¿Cuánto cuesta fumigar una casa en Cali?',
      answer: 'El precio de fumigación residencial en Cali parte desde $80.000 COP dependiendo del tamaño de la vivienda y el tipo de plaga. Ofrecemos cotización gratis por WhatsApp o visita técnica sin compromiso.'
    },
    {
      question: '¿Qué plagas cubren en la fumigación residencial?',
      answer: 'Controlamos cucarachas, hormigas, roedores, arañas, mosquitos (Aedes aegypti), moscas, polillas, ácaros, comején (termites) y otras plagas domésticas comunes en Cali.'
    },
    {
      question: '¿El servicio de fumigación residencial es seguro para mascotas y niños?',
      answer: 'Sí, utilizamos productos de baja toxicidad y eco-amigables. Sin embargo, recomendamos mantener a mascotas y niños fuera del área tratada durante 2-4 horas después de la aplicación.'
    },
    {
      question: '¿Ofrecen garantía en la fumigación residencial?',
      answer: 'Sí, todos nuestros servicios de fumigación residencial incluyen garantía escrita de 1 a 3 meses dependiendo del tipo de plaga y tratamiento aplicado.'
    },
    {
      question: '¿Cuánto tiempo dura el efecto de la fumigación?',
      answer: 'El efecto residual de nuestros productos dura entre 30 y 90 días. Recomendamos tratamientos preventivos cada 3-6 meses para mantener su hogar libre de plagas.'
    }
  ],
  
  'fumigacion-comercial-cali.html': [
    {
      question: '¿Realizan fumigación para empresas y negocios en Cali?',
      answer: 'Sí, somos especialistas en control de plagas para negocios: restaurantes, hoteles, supermercados, bodegas, oficinas, colegios, clínicas y centros comerciales en Cali y el Valle del Cauca.'
    },
    {
      question: '¿Tienen certificados sanitarios para fumigación comercial?',
      answer: 'Sí, contamos con todos los certificados y permisos requeridos por la Secretaría de Salud de Cali para realizar fumigación en establecimientos comerciales que manipulan alimentos.'
    },
    {
      question: '¿Ofrecen fumigación en horarios no comerciales?',
      answer: 'Sí, adaptamos nuestros horarios a las necesidades de su negocio. Realizamos servicios después del horario laboral, en madrugadas o fines de semana para evitar interrupciones.'
    },
    {
      question: '¿Qué tipo de plagas controlan en empresas?',
      answer: 'Cucarachas, roedores (ratas y ratones), hormigas, moscas, mosquitos, ácaros, polillas de alimentos, comején y otras plagas que afectan la higiene y seguridad de su negocio.'
    },
    {
      question: '¿Ofrecen mantenimiento preventivo para empresas?',
      answer: 'Sí, diseñamos programas de control integrado de plagas (MIP) con visitas periódicas de monitoreo y aplicación preventiva, adaptados a las necesidades específicas de su negocio.'
    }
  ],
  
  'control-cucarachas-cali.html': [
    {
      question: '¿Por qué hay tantas cucarachas en Cali?',
      answer: 'Cali tiene un clima tropical ideal para la reproducción de cucarachas. La humedad, temperaturas cálidas y abundancia de alimento en zonas urbanas crean el ambiente perfecto para su proliferación.'
    },
    {
      question: '¿Cuáles son las especies de cucarachas más comunes en Cali?',
      answer: 'Las cucarachas alemán (Blattella germanica), americana (Periplaneta americana) y oriental (Blatta orientalis) son las más frecuentes en hogares y negocios de Cali.'
    },
    {
      question: '¿Cómo eliminar cucarachas definitivamente?',
      answer: 'La eliminación definitiva requiere tratamiento profesional con insecticidas residuales, cebos gel y bloqueo de puntos de entrada. En Fumigaciones Magistrales usamos métodos integrados para eliminar colonias completas.'
    },
    {
      question: '¿Los tratamientos para cucarachas son seguros?',
      answer: 'Sí, utilizamos productos registrados y aprobados para control de plagas en áreas residenciales y comerciales. Aplicamos en zonas estratégicas para minimizar el contacto con personas y mascotas.'
    },
    {
      question: '¿Cuánto dura el efecto del control de cucarachas?',
      answer: 'Nuestros tratamientos tienen efecto residual de 30 a 90 días. Recomendamos un programa de mantenimiento cada 2-3 meses para mantener el control.'
    }
  ],
  
  'control-roedores-cali.html': [
    {
      question: '¿Qué tipo de roedores controlan en Cali?',
      answer: 'Controlamos ratas (Rattus norvegicus y Rattus rattus) y ratones (Mus musculus) en residencias, bodegas, restaurantes, empresas y zonas comunes.'
    },
    {
      question: '¿Cómo ingresan los roedores a mi propiedad?',
      answer: 'Los roedores entran por grietas en paredes, tuberías, techos, puertas mal selladas y ventanillas. Pueden pasar por aberturas de tan solo 6 mm (ratones) o 12 mm (ratas).'
    },
    {
      question: '¿Qué enfermedades transmiten los roedores?',
      answer: 'Los roedores pueden transmitir leptospirosis, hantavirus, salmonelosis, peste bubónica, tifus murino y otras enfermedades a través de sus heces, orina o parásitos que portan.'
    },
    {
      question: '¿Ofrecen desratización con garantía?',
      answer: 'Sí, todos nuestros servicios de control de roedores incluyen garantía escrita. Realizamos seguimiento y retreatamientos si la plaga persiste.'
    },
    {
      question: '¿Cómo prevenir la infestación de roedores?',
      answer: 'Mantenga su propiedad limpia, selle grietas y aberturas, almacene alimentos en recipientes herméticos, elimine fuentes de agua y realice mantenimiento preventivo cada 3-6 meses.'
    }
  ],
  
  'desinfeccion-ambientes-cali.html': [
    {
      question: '¿Qué es la desinfección de ambientes?',
      answer: 'Es el proceso de eliminación de microorganismos patógenos (bacterias, virus, hongos) en superficies y aire mediante productos químicos desinfectantes especializados.'
    },
    {
      question: '¿En qué casos se recomienda desinfectar ambientes?',
      answer: 'Después de brotes de enfermedades, inundaciones, presencia de roedores o plagas, en clínicas, colegios, gimnasios, restaurantes, oficinas y luego de tratamientos de control de plagas.'
    },
    {
      question: '¿Qué tipo de desinfección realizan?',
      answer: 'Aplicamos desinfección por nebulización (frío o caliente), aspersión y limpieza profunda con productos de grado hospitalario eficaces contra COVID-19, dengue, influenza y otros patógenos.'
    },
    {
      question: '¿La desinfección es segura para las personas?',
      answer: 'Sí, utilizamos productos registrados y aprobados. Las áreas tratadas pueden ser ocupadas después del tiempo de ventilación recomendado (generalmente 1-2 horas).'
    },
    {
      question: '¿Ofrecen certificado de desinfección?',
      answer: 'Sí, emitimos certificado oficial de desinfección con fecha, productos utilizados, áreas tratadas y recomendaciones, válido para auditorías y requisitos sanitarios.'
    }
  ],
  
  'certificados-fumigacion-cali.html': [
    {
      question: '¿Para qué sirven los certificados de fumigación?',
      answer: 'Los certificados son requisitos legales para empresas que manipulan alimentos, restaurantes, hoteles, clínicas y otros establecimientos que deben cumplir con normas sanitarias.'
    },
    {
      question: '¿Qué información incluye el certificado de fumigación?',
      answer: 'Incluye nombre de la empresa tratada, dirección, fecha del servicio, productos utilizados, plagas controladas, técnico responsable, número de registro y vigencia.'
    },
    {
      question: '¿Cuánto dura la vigencia del certificado?',
      answer: 'La vigencia depende del tipo de tratamiento y normativa. Generalmente es de 1 a 6 meses. Nuestros certificados indican claramente la fecha de vencimiento.'
    },
    {
      question: '¿Emiten certificados sanitarios para la Secretaría de Salud?',
      answer: 'Sí, nuestros certificados cumplen con los requisitos de la Secretaría de Salud de Cali y el Valle del Cauca, y son aceptados en auditorías sanitarias.'
    },
    {
      question: '¿Realizan fumigación y emiten certificado el mismo día?',
      answer: 'Sí, en la mayoría de los casos emitimos el certificado de fumigación el mismo día del servicio. Para empresas con requisitos específicos, podemos emitir certificados digitales en PDF al instante.'
    }
  ],
  
  'recarga-extintores-cali.html': [
    {
      question: '¿Por qué es importante recargar los extintores?',
      answer: 'Los extintores pierden presión y el agente extintor con el tiempo. Una recarga periódica garantiza que funcionen correctamente en caso de incendio.'
    },
    {
      question: '¿Cada cuánto tiempo se deben recargar los extintores?',
      answer: 'Según la normativa colombiana (Icontec NTC 1581), los extintores deben ser recargados cada 5 años o cuando el manómetro indique presión baja.'
    },
    {
      question: '¿Qué tipos de extintores recargan?',
      answer: 'Recargamos extintores de polvo químico seco (ABC, BC), CO2, espuma, agua y extintores para cocinas (K). Contamos con equipos para todos los tipos de extintores portátiles.'
    },
    {
      question: '¿Ofrecen mantenimiento completo de extintores?',
      answer: 'Sí, realizamos mantenimiento preventivo y correctivo que incluye: revisión de presión, limpieza, cambio de sellos, prueba hidrostática (cada 5 o 12 años según tipo) y recarga con agentes de calidad.'
    },
    {
      question: '¿Emiten certificado de recarga de extintores?',
      answer: 'Sí, emitimos certificado de mantenimiento y recarga con fecha, tipo de extintor, agente utilizado, presión, número de serie y próxima fecha de revisión.'
    }
  ]
};

// Función para generar JSON-LD FAQPage
function generateFAQSchema(faqs, businessName = 'Fumigaciones Magistrales Del Valle') {
  const items = faqs.map((faq, index) => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'name': `${businessName} - Preguntas Frecuentes`,
    'description': `Preguntas frecuentes sobre servicios de fumigación y control de plagas en Cali`,
    'mainEntity': items
  };
}

// Procesar cada página de servicio
console.log('🔧 Agregando FAQ Schema a páginas de servicio...\n');

Object.entries(FAQS).forEach(([filename, faqs]) => {
  const filePath = path.join(PROJECT_ROOT, filename);
  
  if (!existsSync(filePath)) {
    console.log(`⚠ ${filename} - Archivo no encontrado`);
    return;
  }

  try {
    let content = readFileSync(filePath, 'utf8');
    
    // Verificar si ya tiene FAQ Schema
    if (content.includes('FAQPage')) {
      console.log(`✓ ${filename} - Ya tiene FAQ Schema`);
      return;
    }

    // Generar FAQ Schema
    const faqSchema = generateFAQSchema(faqs);
    const jsonScript = `
<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>`;

    // Insertar después del opening <head> o antes del cierre </head>
    // Buscar la posición adecuada (después de otros schemas)
    let insertPosition = content.indexOf('</head>');
    
    if (insertPosition === -1) {
      insertPosition = content.indexOf('>') + 1;
    }
    
    // Insertar antes de </head>
    const newContent = content.slice(0, insertPosition) + jsonScript + content.slice(insertPosition);
    
    writeFileSync(filePath, newContent);
    console.log(`✓ ${filename} - FAQ Schema agregado (${faqs.length} preguntas)`);
    
  } catch (err) {
    console.error(`✗ ${filename} - Error: ${err.message}`);
  }
});

console.log('\n✅ Proceso completado!');
