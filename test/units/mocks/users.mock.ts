export const signResponseMock = {
  accessToken: 'randomJwt',
};

export const loginOrRegisterMock = {
  email: 'teste@teste.com',
  password: 'teste',
};

export const userMock = {
  id: 'id',
  ...loginOrRegisterMock,
};
