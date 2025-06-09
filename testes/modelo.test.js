const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Cadastro de respostas e contagem correta', () => {
  // 1. cria pergunta
  const idPerg = modelo.cadastrar_pergunta('Qual a cor do cavalo branco de Napoleão?');

  // 2. cria duas respostas
  const idResp1 = modelo.cadastrar_resposta(idPerg, 'Branco');
  const idResp2 = modelo.cadastrar_resposta(idPerg, 'Cinza');

  // 3. garante retorno dos IDs
  expect(typeof idResp1).toBe('number');
  expect(idResp2).toBe(idResp1 + 1);

  // 4. recupera pergunta individualmente
  const pergunta = modelo.get_pergunta(idPerg);
  expect(pergunta.texto).toBe('Qual a cor do cavalo branco de Napoleão?');

  // 5. recupera respostas da pergunta
  const respostas = modelo.get_respostas(idPerg);
  expect(respostas).toHaveLength(2);
  expect(respostas.map(r => r.texto))
        .toEqual(expect.arrayContaining(['Branco', 'Cinza']));

  // 6. verifica contagem agregada
  expect(modelo.get_num_respostas(idPerg)).toBe(2);

  // 7. confere que listar_perguntas também reflete a contagem
  const lista = modelo.listar_perguntas();
  expect(lista[0].num_respostas).toBe(2);
});
