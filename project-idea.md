# SLEEP TRACKER
## Idea
A ideia principal é um aplicativo expo com react native e firebase (para banco de dados e push notification) para registrar, em três momentos (8am, 12pm, 20pm - Todos BRT), o tracking dos habitos, alimentação etc que podem estar causando o sono diurno no usuário.


## Formularios / Registros
Nos horários estipulados, o firebase mandará uma notificação dizendo para preencher o formulário e indicará qual dos formulários abrir nos dados. Clicando na notificação o usuário é levado ao formulário para preencher os seguintes dados

🕗 8h — manhã
Sono
Dormi ___h
Qualidade: ☐ muito bom ☐ bom ☐ ok ☐ ruim ☐ péssimo  
Despertares noturnos(quantidade): _
Janta: ☐ leve ☐ normal ☐ pesado
Nível de sono ao acordar? ☐ descansado ☐ pouco sono ☐ muito sono
Observações: _

🕛 12h — antes do almoço
Manhã
Tive sono de manhã? ☐ bastante ☐ pouco ☐ nada
Horário: _
Dormi: ☐ sim ☐ não 
Luz solar?  ☐ sim ☐ não 
Café da manhã: ☐ leve ☐ normal ☐ pesado
Café? ☐ sim ☐ não
Doce? ☐ sim ☐ não 
Exercício? ☐ sim ☐ não
Observações: _  

Estado
Foco: ☐ muito bom ☐ bom ☐ ok ☐ ruim ☐ péssimo  
Estresse: ☐ muito ☐ leve ☐ nada  
Ansiedade:  ☐ muito ☐ leve ☐ nada  


🕖 20h — fim do dia
Tarde
Tive sono a tarde? ☐ bastante ☐ pouco ☐ nada
Horário: _
Dormi: ☐ sim ☐ não
Almoço: ☐ leve ☐ normal ☐ pesado
Café? ☐ sim ☐ não
Doce? ☐ sim ☐ não 
Exercício? ☐ sim ☐ não
Observações: _ 

Estado
Foco: ☐ muito bom ☐ bom ☐ ok ☐ ruim ☐ péssimo  
Estresse: ☐ muito ☐ leve ☐ nada  
Ansiedade:  ☐ muito ☐ leve ☐ nada


## Entidades
De acordo com os formulários, traçar um plano para a modelagem dos dados. Esses posteriormente serão enviados para uma IA para fazer a análise e um relatório sobre as possíveis causas do sono diurno.

