import bcrypt from "bcrypt";

//creamos 2 funciones 

//aplicar el hash al password
//comparar el password brindado con la base de datos

//esto se escribe con esta sintaxis, sino no funciona
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword};