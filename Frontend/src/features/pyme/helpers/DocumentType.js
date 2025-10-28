export const getDocumentTypeFromFile = (file) => {
  const fileName = file.name.toLowerCase();

  // Mapeo de nombres de archivo a los enums exactos del backend
  const typeMappings = [
    {
      patterns: [
        "dni",
        "cedula",
        "identificacion",
        "id",
        "pasaporte",
        "carnet",
      ],
      type: "ID_CARD",
    },
    {
      patterns: ["estado", "resultado", "financial", "financiero", "income"],
      type: "FINANCIAL_STATEMENT",
    },
    { patterns: ["balance", "balances", "general"], type: "BALANCE_SHEET" },
    {
      patterns: ["poder", "notarial", "power", "notaria"],
      type: "NOTARIAL_POWER",
    },
    {
      patterns: ["iva", "impuesto", "tax", "tributario", "declaracion"],
      type: "TAX_RETURN",
    },
    {
      patterns: [
        "domicilio",
        "address",
        "residencia",
        "servicio",
        "luz",
        "agua",
        "gas",
      ],
      type: "ADDRESS_PROOF",
    },
    {
      patterns: [
        "banco",
        "bank",
        "referencia",
        "reference",
        "extracto",
        "estado_cuenta",
      ],
      type: "BANK_REFERENCE",
    },
  ];

  const matchedType = typeMappings.find((mapping) =>
    mapping.patterns.some((pattern) => fileName.includes(pattern))
  );

  // Si no encuentra coincidencia, usar FINANCIAL_STATEMENT como default (más común para créditos)
  return matchedType ? matchedType.type : "FINANCIAL_STATEMENT";
};
