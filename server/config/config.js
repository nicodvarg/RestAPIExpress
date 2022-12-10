/* 
==================================
            PUERTO
==================================
*/
process.env.PORT = process.env.PORT || 3000;

/* 
==================================
            ENTORNO
==================================
*/
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/* 
==================================
        CADUCIDAD TOKEN
==================================
*/
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || "48h";

/* 
==================================
        SEMILLA TOKEN
==================================
*/
process.env.SEED = process.env.SEED || "esta-es-la-semilla-desarrollo";

/* 
==================================
            BASE DE DATOS
==================================
*/
process.env.URLDB = process.env.URLDB || "mongodb://localhost:27017/cafe";

/* 
==================================
        GOOGLE CLIENT ID
==================================
*/
process.env.CLIENT_ID = process.env.CLIENT_ID || "365725802520-vv1b507uqa82c1e5pfpdi2rcm2cgg6is.apps.googleusercontent.com";