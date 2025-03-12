[Back to main Logbook Page](../hci_logbook.md)

---
# B. Stage 1 - Context Definition


# B.1. Competitor Identification
>	The competitor analysis will entail an identification of all competitors, with brief descriptions and a collection of the look and feel of their solutions, e.g., with screenshots, etc. It will also include a detailed analysis of the competitor deemed the best or more representative.

## B.1a. Competitors

| **Competitor**    | **Description**                             | Information repository              |
| ----------------- | ------------------------------------------- | ----------------------------------- |
| Field |  Application for booking sports fields    |[Competitor Analysis Field](competitors/Competitor%20Analysis%20Field.md)  |
| Playtomic | Application for booking sports fields | [Competitor Analysis Playtomic](competitors/Competitor%20Analysis%20Playtomic.md)|



## B.1b. Detailed Competitor Analysis
>	Choose the most notable competitor and do a more thorough analysis of their interactive solution


We chose to conduct a more detailed analysis of the Field application because it closely resembles our project idea. It is a simple yet effective application where operations can be performed easily.


### - Heuristic Evaluation


#### Method

The heuristic evaluation was based on Nielsen’s method, using a set of predefined heuristics to assess the usability of the Field application. The process followed these steps:

### 1. Selection of Heuristics

Jakob Nielsen’s 10 usability heuristics were used.

### 2. Evaluation Procedure

- Each group member independently assessed the platform, identifying usability issues based on the selected heuristics.

### 3. Number of Evaluators

- The evaluation was conducted by students **113602**, **114947** and **115931**.

### 4. Severity Scale

The following severity scale was used: [Severity Scale](heuristic_evaluations/severity_scale_heuristic_evaluation.md)

### 5. Consensus Process

- After the individual analysis, we held a meeting to discuss the identified issues.
- When a problem was identified by only one expert, the other members reassessed it to decide whether it should be included in the final list.
- The issues were organized according to their severity, and improvement suggestions were presented.

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

Task: Booking a 7-a-side football field

| Step # | Book a 7-a-side football field | Will User Know What to do at this step? (Yes/No) | Notes | If the user does the right thing, will they know it is progressing towards goal? (Yes/No) | Notes | Is Action Successful? (Yes/No) | Suggestions for Improvement |     |
| ------ | ---------------------- | ------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------- | ----- | ------------------------------ | --------------------------- | --- |
| 1      | Select field location through filters  | Yes                                         |       | Yes                                                                                  |       | Yes                      |               |     |
| 2      | Select the desired field   | Yes                                      |       | Yes                                                                                  |       | Yes              | Add price filter   |     |
| 3      | Choose reservation time    |Yes                                |       | Yes                                                                               |       | Yes                   | Simplify time selection to avoid user errors with 30-minute slots.            |     |
| 4   | Proceed to checkout     | Yes                                |       | Yes                                                                             |       | Yes                     |               |     |

Task: Choosing a Padel court with available equipment

| Step # |Choosing a Padel court with available equipment | Will User Know What to do at this step? (Yes/No) | Notes | If the user does the right thing, will they know it is progressing towards goal? (Yes/No) | Notes | Is Action Successful? (Yes/No) | Suggestions for Improvement |     |
| ------ | ---------------------- | ------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------- | ----- | ------------------------------ | --------------------------- | --- |
| 1      | Select field location   | Yes                                    |       | Yes                                                                               |       | Yes                     |               |     |
| 2      | Choose a court with equipment  | Yes                                       |       | Yes                                                                           |       | Yes                    | Add a filter for courts with available equipment.             |     |
| 3      | Choose reservation time  | Yes                                    |       | Yes                                                                              |       | Yes                     | Simplify time selection to avoid user errors with 30-minute slots.            |     |
| 4   | Proceed to checkout     | Yes                                |       | Yes                                                                             |       | Yes                     |               |     |




---

# B.2. Users
>	For the users, there are two goals: 1) understand the current status of users in the domain you are addressing. How do they manage, what are the main tasks they do, if they use some tool for the purpose, what are current challenges, what might be improved, what might be new features, ...


## B.2a. Method


The interviews aimed to gather user insights and suggestions. We considered users who had experienced booking issues to determine if the app would provide an appealing solution.
## B.2b. Results

>	This section tracks all informal user interviews, summarizing key insights and linking to detailed notes for each session. 

### Interview List 
| Date       | Participant / Role | Key Insights                                                    | Link to Notes                |     |
| ---------- | ------------------ | --------------------------------------------------------------- | ---------------------------- | --- |
| 26/02/2025| Nuno / Potencial utilizador     | Accumulation of points for bookings made through the app, which can later be redeemed for benefits. It was also suggested to offer a discount for users who book a field through the app.| [Entrevista Nuno](interviews/interview-Nuno.md) |     |
|27/02/2025        |      Potencial utilizador           |     Have an admin page on the website where the administrators of each sports facility can update information about it, such as marking it as closed. When a reservation is made, send the details to everyone who was "invited" so they can accept the invitation. In the case of a 5v5 football match, if fewer than 10 people accept the invitation, the reservation is automatically canceled.                                        |                            [Entrevista Anónimo](interviews/interview-Anónimo.md)  |
|27/02/2025  |  Theo/ Potencial utilizador |  If there is a group wanting to play 11v11 football, and there are missing players, the app should assist in finding the missing players.  |  [Entrevista Theo](interviews/interview-Theo.md)  |

### Common Themes & Patterns 

- **Recurring Problems:** 
	- Difficulty communicating with sports pavilions
	- Sports pavilion websites with outdated contact information
- **Frequently Used Tools:** 
	- Google
	- Google Maps
- **Desired Features / Solutions:** 
	- Booking through the app so the user doesn’t have to visit the location or call by phone.
	- Filtering fields by their characteristics.
	- When a reservation is made, invite the people who will play to ensure better control, avoiding unexpected cancellations. If the minimum number of players is not met, the reservation is automatically canceled.
- --- 


---
[Back to main Logbook Page](../hci_logbook.md)

---
