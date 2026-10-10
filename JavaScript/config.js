/**
 * Fidela Web - Configurações Editáveis
 * 
 * Preencha os dados abaixo com as informações do seu negócio.
 * Se ainda não tiver o número de WhatsApp ou e-mail, pode deixar como está.
 */

window.SITE_CONFIG = {
  // WhatsApp: digite 55 + DDD + número (apenas dígitos).
  whatsappNumero: "5561981714067",

  // Telefone / WhatsApp formatado para exibição
  telefone: "(61) 98171-4067",

  // Mensagens pré-definidas que abrem na conversa do WhatsApp
  whatsappMensagem: "Olá! Vim pelo site da Fidela Web e gostaria de saber mais.",
  whatsappMensagemPlano: "Olá! Tenho interesse no plano da Fidela Web.",

  // Usuário do Instagram (sem o @)
  instagramUsuario: "fidelaweb.digital",

  // E-mail de contato comercial
  email: "fidelaweb@gmail.com",

  // Valor da mensalidade exibido no card do plano
  precoMensal: "R$ 79,90",

  // Se 'true', exibe o valor acima. Se 'false', exibe "Fale com a gente para saber o valor"
  mostrarPreco: true,

  // Vitrine de sites-modelo demonstrativos.
  // Se tiver um link, coloque a URL completa em 'url'.
  // Se 'url' for vazio (""), o card exibirá automaticamente o selo "Em breve" e não será clicável.
  modelos: [
    {
      nome: "Barbearia",
      descricao: "Modelo para barbearias e salões",
      url: ""
    },
    {
      nome: "Comércio local",
      descricao: "Modelo para pequenas lojas e comércios",
      url: ""
    }
  ]
};
