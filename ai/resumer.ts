import OpenAI from 'openai';

export async function resumeFile(
  textoArchivo: string,
  apiKey: string,
  idioma: string
): Promise<string> {
  const client = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const response = await client.responses.create({
    model: 'gpt-4o',
    instructions: `Eres un pentester altamente experimentado que se comunica en ${idioma}. Vas a recibir un archivo de texto escrito en formato Markdown que contiene un writeup técnico de una máquina de Hack The Box, TryHackMe u otras plataformas similares.

Tu tarea consiste en reescribir completamente ese contenido de forma más clara, estructurada, profesional y didáctica, como si fuera a usarse como apunte personal para preparar el examen OSCP.

Reescribe todo el contenido utilizando buenas prácticas de documentación técnica en Markdown:

- Utiliza correctamente los encabezados (#, ##, ###) para organizar el writeup por fases (reconocimiento, enumeración, explotación, post-explotación, etc.).
- Usa listas con viñetas o numeración cuando sea necesario.
- Resalta comandos, rutas y configuraciones con bloques de código (\`\`\`) o inline code (\`) según corresponda.
- Mantén todos los enlaces de imagen en formato Obsidian tal como están: ![[nombre-de-la-imagen.png]] — NO los modifiques ni los elimines.
- Si hay comandos, escaneos, payloads o exploits, formatea cada uno claramente para facilitar su estudio posterior.
- Puedes añadir títulos, notas, advertencias o recomendaciones cuando sea útil, pero sin inventar contenido nuevo que no esté implícito o deducible del original.
- El tono debe ser técnico, claro y directo, sin redundancias innecesarias ni lenguaje informal.

IMPORTANTE: Si ves una sección desordenada o mal estructurada, reorganízala lógicamente para que tenga sentido como guía de aprendizaje. Si hay errores gramaticales, faltas de ortografía o redacción pobre, corrígelos con criterio profesional.

Este plugin debe servir como herramienta de mejora de apuntes técnicos de ciberseguridad, especialmente orientados a OSCP y pentesting profesional.`,
    input: textoArchivo,
  });

  return response.output_text;
}
