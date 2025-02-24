<!-- This Heuristic Evaluation Workbook replicates the one proposed by the 
Nielsen Norman Group available at: https://media.nngroup.com/media/articles/attachments/Heuristic_Evaluation_Workbook_-_Nielsen_Norman_Group.pdf
-->

**Evaluator**: [Joaquim Martins]
**Date**: [24-02-2025]
**Product**: [Feild]

Severity Scale adopted: [[severity_scale_heuristic_evaluation]]
Summary of each usability heuristic: [here](https://media.nngroup.com/media/articles/attachments/Heuristic_Summary1-compressed.pdf)

# 1 Visibility of System Status

> The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.
>
> - Does the design clearly communicate its state?
> - Is feedback presented quickly after user actions?

| **Issue**                                             | **Severity** | Recommendation                                                        |
| ----------------------------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Falta de feedback quando todos os elementos são carregados | 2                  | Exibir uma mensagem indicando que não há mais campos para carregar |

# 2 Match Between System and The Real World

> The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions, making information appear in a natural and logical order.
>
> - Will user be familiar with the terminology used in the design?
> - Do the design’s controls follow real-world conventions?

| **Issue**                                                             | **Severity** | Recommendation                                                                                             |
| --------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Informação pouco organizada, dificultando a navegação e a compreensão. | 3                  | Melhorar a hierarquia visual, destacando informações essenciais como preço, disponibilidade e reservas. |
| Mistura de idiomas sem distinção clara, tornando a leitura confusa.       | 2                  | Criar botões para alternar entre PT/EN ou separar melhor as versões dos idiomas.                         |

# 3 User Control and Freedom

> Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process.
>
> - Does the design allow users to go back a step in the process?
> - Are exit links easily discoverable?
> - Can users easily cancel an action?
> - Is Undo and Redo supported?

| **Issue**                                                                   | **Severity** | Recommendation                                                                        |
| --------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| Falta de um botão de "Voltar" ou forma clara de cancelar ações, como reservas. | 3                  | Adicionar um botão visível para voltar atrás em cada etapa do processo de reserva. |

# 4 Consistency and Standards

> Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.
>
> - Does the design follow industry conventions?
> - Are visual treatments used consistently throughout the design?

| **Issue**                                                                                          | **Severity** | Recommendation                                                                                   |
| -------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| Inconsistência na linguagem usada (exemplo: mistura de termos técnicos e informais no mesmo contexto). | 3                  | Unificar a terminologia usada no site, garantindo que segue padrões reconhecidos na indústria. |

# 5 Error Prevention

> Good error messages are important, but the best designs carefully prevent problems from occurring in the first place. Either eliminate error-prone conditions, or check for them and present users with a confirmation option before they commit to the action.
>
> - Does the design prevent slips by using helpful constraints?
> - Does the design warn users before they perform risky actions?

| **Issue** | **Severity** | Recommendation |
| --------------- | ------------------ | -------------- |
| Something wrong | 3                  |                |
| Another thing   | 4                  |                |

# 6 Recognition Rather than Recall

> Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another. Information required to use the design (e.g. field labels or menu items) should be visible or easily retrievable when needed.
>
> - Does the design keep important information visible, so that users do not have to memorize it?
> - Does the design offer help in-context?

| **Issue**                                                                                                           | **Severity** | Recommendation                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Informações importantes (ex: regras, política de cancelamento) não são facilmente acessíveis no processo de reserva | 3                  | ostrar um resumo das regras e políticas antes da confirmação da reserva, em vez de obrigar o utilizador a lembrar-se delas. |

# 7 Flexibility and Efficiency of Use

> Shortcuts — hidden from novice users — may speed up the interaction for the expert user such that the design can cater to both inexperienced and experienced users. Allow users to tailor frequent actions.
>
> - Does the design provide accelerators like keyboard shortcuts and touch gestures?
> - Is content and funtionality personalized or customized for individual users?

| **Issue**                                                                                                                      | **Severity** | Recommendation                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Falta de personalização da experiência para utilizadores frequentes (ex: sugestões automáticas com base em reservas anteriores) | 2                  | Implementar sugestões inteligentes baseadas no histórico de reservas do utilizador para facilitar novas marcações. |

# 8 Aesthetic and Minimalist Design

> Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility.
>
> - Is the visual design and content focused on the essentials?
> - Have all distracting, unnescessary elements been removed?

| **Issue**                                                                                                           | **Severity** | Recommendation                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Destaque insuficiente para informações realmente importantes (ex: preço do campo pode não ser imediatamente visível) | 3                  | Tornar as informações essenciais mais destacadas, como usar negrito, cor diferente ou ícones para facilitar a identificação rápida. |

# 9 Help Users Recognize, Diagnose, and Recover from Errors

> Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.
>
> - Does the design use traditional error message visuals, like bold, red text?
> - Does the design offer a solution that solves the error immediately?

| **Issue** | **Severity** | Recommendation |
| --------------- | ------------------ | -------------- |
| Something wrong | 3                  |                |
| Another thing   | 4                  |                |

# 10 Help and Documentation

> It’s best if the system doesn’t need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks.
>
> - Is help documentation easy to search?
> - Is help provided in context right at the moment when the user requires it?

| **Issue**                                                                           | **Severity** | Recommendation                                                                                                                                |
| ----------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Não há barra de pesquisa na seção de ajuda                                            | 4                  | Adicionar uma barra de pesquisa para que os usuários encontrem rapidamente respostas para suas dúvidas.                                     |
| Os títulos das seções são genéricos e podem não ser intuitivos para novos usuários | 3                  | Reformular os títulos para serem mais descritivos, por exemplo, "Como recuperar minha conta" em vez de "Questões relativas à minha Conta". |
