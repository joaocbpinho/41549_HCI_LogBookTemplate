[Back to main Logbook Page](../hci_logbook.md)

---
# B. Stage 1 - Context Definition


# B.1. Competitor Identification
>	The competitor analysis will entail an identification of all competitors, with brief descriptions and a collection of the look and feel of their solutions, e.g., with screenshots, etc. It will also include a detailed analysis of the competitor deemed the best or more representative.



## B.1a. Competitors


| **Competitor**    | **Description**                             | Information repository              |
| ----------------- | ------------------------------------------- | ----------------------------------- |
| Field |  Aplicação para reserva de campos     |[Competitor Analysis Field](competitors/Competitor%20Analysis%20Field.md)  |                          



## B.1b. Detailed Competitor Analysis
>	Choose the most notable competitor and do a more thorough analysis of their interactive solution


Escolhemos para fazer uma análise mais detalhada a aplicação Field, pois é uma aplicação mais parecida com a nossa ideia de projeto, uma aplicação simples mas eficaz em que é possível realizar operações facilmente.


### - Heuristic Evaluation


#### Method

A avaliação heurística foi realizada tendo por base no método de Nielsen, utilizando um conjunto de heurísticas predefinidas para avaliar a usabilidade da aplicação Field. O processo seguiu os seguintes passos:

### 1. Seleção das Heurísticas

Foram utilizadas as 10 heurísticas de usabilidade de Jakob Nielsen.

### 2. Procedimento de Avaliação

- Cada um dos elementos do grupo avaliou a plataforma de forma independente, identificando problemas de usabilidade com base nas heurísticas selecionadas. 


### 3. Número de Especialistas

- A avaliação foi realizada pelos alunos **113602**, **114947** e **115931**. 

### 4. Escala de Gravidade

A escala de gravidade usada foi a escala seguinte [escala de severidade](heuristic_evaluations/severity_scale_heuristic_evaluation.md)
### 5. Processo de Consenso

- Após a análise individual, realizamos uma reunião para debater os problemas encontrados.
- Quando um problema foi identificado por apenas um especialista, os outros membros foram reavaliar para decidir se deveria ser incluído na lista final.
- Os problemas foram organizados conforme a gravidade, e sugestões de melhoria foram apresentadas.

#### Individual Evaluations


- [114947_heuristic_evaluation_workbook](heuristic_evaluations/114947_heuristic_evaluation_workbook.md)

- [115931_heuristic_evaluation_workbook](heuristic_evaluations/115931_heuristic_evaluation_workbook.md)

- [113602_heuristic_evaluation_workbook](heuristic_evaluations/113602_heuristic_evaluation_workbook.md)


#### Consensus

>	After the individual analysis by each expert, all results should be gathered in a consensus table. If an expert has not found any of the problems found by other experts, they should analyse it, at this point, and give it a severity.

| **Issue**       | **114947** | 115931 | 113602 | Recommendations                             |
| --------------- | ------------ | -------- | -------- | ------------------------------------------- |
| Unclear booking status | 3            | X     | X     | In some fields, update the calendar to prevent booking when already reserved. |
| Back button | 2           | 3      |  0       | Add a back button to avoid having to return to the homepage repeatedly. |
| Unclear language mix |      X        |      2   | X           | Add a PT/EN button to facilitate navigation for non-Portuguese-speaking users. |
| Booking issue  | 2  | X |  3| Use "slots" of 1 hour instead of 30-minute increments, as selecting a 30-minute slot currently reserves the next half-hour automatically, which can cause user confusion depending on the field. |
| Filter by facilities (e.g., showers, complexes with available sports equipment for reservation)  | 2 | 3 | X| Filter fields by amenities to make it easier to find a field with a specific feature. |
| Important information (e.g., rules, cancellation policy) not easily accessible during the booking process | X | 3 |X| Show a summary of the rules and policies before confirming the booking, instead of requiring the user to remember them. |
| Lack of personalized experience for frequent users (e.g., automatic suggestions based on past bookings) | X | 2 | X| Implement smart suggestions based on the user's booking history to facilitate new reservations. |
| Internet connection | X| X | 2| Display an error message when there is no internet connection, instead of just showing a blank page. |
| Help page not easily visible |2 |  2 |0          | Move the help page to the top of the screen. |


### - SWOT Analysis - Field Application

| **SWOT Element** | **HCI Focus** | **Example in UX/UI** |
|-----------------|-------------|--------------------|
| **Strengths** | Simple and effective application that delivers what the user needs without difficulty. | "The clear and simple interface makes navigation and booking easy." |
| **Weaknesses** | Unclear booking status, lack of a back button, mixed languages, issues managing time slots, important information not easily accessible. | "The lack of a back button forces users to return to the homepage, making navigation difficult." |
| **Opportunities** | Implementation of a PT/EN button, improved visibility of essential information, automatic suggestions based on past bookings. | "Adding a PT/EN button would help non-Portuguese-speaking users navigate the app more easily." |
| **Threats** | Competition from other field booking applications that solve the cost-splitting issue. | "Applications that handle cost-splitting more efficiently may attract users away from this platform." |

---
### - Cognitive Walkthrough

#### Method
The method used was Streamlined Cognitive walkthrough.
#### Task Selection and Task Analysis
The selected tasks (booking a 7-a-side football field and choosing a Padel court with available equipment for reservation) were chosen because they are essential to the application.







| Task                        | Subtasks                               |
| --------------------------- | -------------------------------------- |
| **1. Book a 7-a-side football field** | Choose the field location     |
|                             | Select the desired field |
|                             | Add the reservation time     |
|                             | Proceed to checkout                  |





| Task                          | Subtasks                                |
| ----------------------------- | --------------------------------------- |
| **2. Choose a Padel court with available equipment for reservation** | Choose the field location |
|                               | Select a court with available equipment            |
|                               | Add the reservation time             |
|                               | Proceed to checkout                  |


#### Results

Task: [This is the task]

| Step # | Reserva de campo de futebol de 7 | Will User Know What to do at this step? (Yes/No) | Notes | If the user does the right thing, will they know it is progressing towards goal? (Yes/No) | Notes | Is Action Successful? (Yes/No) | Suggestions for Improvement |     |
| ------ | ---------------------- | ------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------- | ----- | ------------------------------ | --------------------------- | --- |
| 1      | Escolher a localidade do campo através da filtragem do website  | Yes                                         |       | Yes                                                                                  |       | Yes                      |               |     |
| 2      | Escolher o campo pretendido   | Yes                                      |       | Yes                                                                                  |       | Yes              | Adição de filtro por preço   |     |
| 3      | Adicionar a hora da reserva    |Yes                                |       | Yes                                                                               |       | Yes                   | Colocar o agendamento de forma mais simples pois pode a levar a um erro do utilizador caso queira reservar o campo apenas para 30 min.            |     |
| 4   | Proceder para checkout     | Yes                                |       | Yes                                                                             |       | Yes                     |               |     |

Task: [This is the task]

| Step # | Reservar campo de Padel que tenha equipamento disponível para reserva | Will User Know What to do at this step? (Yes/No) | Notes | If the user does the right thing, will they know it is progressing towards goal? (Yes/No) | Notes | Is Action Successful? (Yes/No) | Suggestions for Improvement |     |
| ------ | ---------------------- | ------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------- | ----- | ------------------------------ | --------------------------- | --- |
| 1      | Escolher localidade do campo   | Yes                                    |       | Yes                                                                               |       | Yes                     |               |     |
| 2      | Escolher um campo que tenha equipamento disponível   | Yes                                       |       | Yes                                                                           |       | Yes                    | Adicionar filtragem de campos que têm equipamento para reserva, facilita o utilizador de modo a não ter de visualizar todos os campos que não têm equipamento             |     |
| 3      | Adicionar a hora da reserva  | Yes                                    |       | Yes                                                                              |       | Yes                     | Colocar o agendamento de forma mais simples pois pode a levar a um erro do utilizador caso queira reservar o campo apenas para 30 min.            |     |
| 4   | Proceder para checkout     | Yes                                |       | Yes                                                                             |       | Yes                     |               |     |




---

# B.2. Users
>	For the users, there are two goals: 1) understand the current status of users in the domain you are addressing. How do they manage, what are the main tasks they do, if they use some tool for the purpose, what are current challenges, what might be improved, what might be new features, ...


## B.2a. Method

[What approach was followed to talk with users; what kind of users were considered. What was the goal of the interviews? What were the questions considered?]

O objetivo das entrevistas foi ajudar-nos a esclarecer possíveis soluções e sugestões dos entrevistados. Foram considerados utilizadores que passaram por problemas de reserva de campos de modo a perceber se a aplicação daria uma solução apelativa para os mesmos.
## B.2b. Results

>	This section tracks all informal user interviews, summarizing key insights and linking to detailed notes for each session. 

### Interview List 
| Date       | Participant / Role | Key Insights                                                    | Link to Notes                |     |
| ---------- | ------------------ | --------------------------------------------------------------- | ---------------------------- | --- |
| 26/02/2025| Nuno / Potencial utilizador     | Acumulação de pontos caso seja feita a reserva da aplicação, para depois descontar para algumas regalias, e também foi sugerido que seja dado um desconto para os utilizadores reservem um campo pela aplicação| [Entrevista Nuno](interviews/interview-Nuno.md) |     |
|27/02/2025        |      Potencial utilizador           |     Haver no website uma página admin para os administradores de cada pavilhão colocarem informações sobre o mesmo, por exemplo estar fechado. Quando houver uma reserva enviar as informações para toda a gente que foi "convidada", de modo a aceitarem o convite no caso de futebol 5v5 caso não hajam 10 pessoas que tenham aceitado o convite a reserva é cancelada automaticamente.                                              |                                 [Entrevista Anónimo](interviews/interview-Anónimo.md)  |
|27/02/2025  |  Theo/ Potencial utilizador |  Caso exista um grupo que queira jogar futebol 11vs11, caso faltem jogadores a aplicação auxiliar essas ajuda a encontrar pessoas que faltem.  |  [Entrevista Theo](interviews/interview-Theo.md)  |

### Common Themes & Patterns 

- **Recurring Problems:** 
	- Dificuldade de comunicação com os pavilhões desportivos
	- Websites dos pavilhões desportivos com contactos desatualizados
- **Frequently Used Tools:** 
	- Google
	- Google Maps
- **Desired Features / Solutions:** 
	- Reserva pela aplicação para o utilizador não se ter de deslocar ao local presencialmente ou que tenha de andar sempre a ligar pelo telemóvel.
	- Filtragem de campos por características dos mesmos.
	- Aquando é feita uma reserva convidar as pessoas que vão jogar para haver maior controle, de modo a não haver desmarcações inesperadas, caso não haja o número mínimo de jogadores é cancelada a reserva.
- --- 


---
[Back to main Logbook Page](../hci_logbook.md)

---
