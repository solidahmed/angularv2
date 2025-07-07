# Lovable Project Documentation Generator Prompt

## Instructions for Lovable AI

Use this prompt to generate comprehensive project documentation for any Lovable application. Copy and paste this prompt into Lovable and customize the [PROJECT_NAME] and [PROJECT_DESCRIPTION] placeholders with your specific project details.

---

## **DOCUMENTATION GENERATION PROMPT**

```
Please create comprehensive project documentation for my [PROJECT_NAME] application. This is a [PROJECT_DESCRIPTION]. 

Generate the following documentation files in a "Resources" folder:

### 1. README.md
Create a comprehensive README that includes:
- Project overview with live URL
- Core features and capabilities (list all major features)
- Technology stack (React, TypeScript, Vite, Tailwind, Shadcn/UI, etc.)
- Component architecture overview
- Getting started instructions
- Deployment instructions via Lovable
- Key features deep dive
- System architecture summary
- Integration capabilities
- Future enhancements roadmap
- Support and documentation links

### 2. API_DOCUMENTATION.md
Create detailed API documentation including:
- Authentication methods
- Endpoint specifications with request/response examples
- Data models and schemas
- Error handling and status codes
- Rate limiting information
- Integration examples
- SDK information if applicable
- Testing endpoints
- Webhook documentation if relevant

### 3. BRD_DOCUMENT.md (Business Requirements Document)
Create a comprehensive business requirements document with:
- Executive summary
- Business objectives and goals
- Stakeholder analysis
- Functional requirements (detailed feature specifications)
- Non-functional requirements (performance, security, usability)
- User stories and acceptance criteria
- Business rules and constraints
- Success metrics and KPIs
- Risk assessment
- Timeline and milestones

### 4. SRS_DOCUMENT.md (Software Requirements Specification)
Create detailed technical specifications including:
- System overview and architecture
- Functional specifications for each component
- Technical requirements and constraints
- User interface requirements
- Performance requirements
- Security requirements
- Data requirements and models
- Integration requirements
- Testing requirements
- Deployment requirements

### 5. FILE_STRUCTURE_AND_FLOW.md
Create comprehensive architectural documentation with:
- Complete directory structure with explanations
- File responsibilities and usage
- Component hierarchy diagrams
- Application flow diagrams using mermaid syntax
- Data flow architecture
- State management patterns
- Integration points
- External library usage
- Key architectural patterns

### 6. REACT_TO_ANGULAR_MIGRATION.md
Create a migration guide including:
- Migration strategy overview
- Component mapping between React and Angular
- State management migration approach
- Routing migration strategy
- UI library alternatives
- Build system changes
- Testing strategy migration
- Timeline and phases
- Risk mitigation strategies

## Requirements for all documents:
1. **Accuracy**: Ensure all information reflects the actual application structure and features
2. **Completeness**: Cover all aspects thoroughly with proper sections and subsections
3. **Professional Format**: Use proper markdown formatting with tables, code blocks, and diagrams
4. **Mermaid Diagrams**: Include flowcharts and architecture diagrams where appropriate
5. **Cross-references**: Link between documents where relevant
6. **Actionable Content**: Provide practical, implementable information
7. **Current Information**: Reflect the actual current state of the application

## Specific Instructions:
- Analyze the actual codebase to extract accurate component counts, file structures, and features
- Include exact line counts for major files where relevant
- Provide real examples from the application code
- Ensure all technology stack information is current and accurate
- Include proper table of contents for longer documents
- Use consistent formatting and style across all documents
- Include proper section numbering and organization

Please create these documentation files with comprehensive, professional content that accurately represents the application's current state and provides valuable information for developers, stakeholders, and users.
```

---

## **How to Use This Prompt**

1. **Customize the Prompt**: Replace [PROJECT_NAME] and [PROJECT_DESCRIPTION] with your specific project details
2. **Copy the Complete Prompt**: Copy everything between the triple backticks above
3. **Paste into Lovable**: Paste the customized prompt into your Lovable chat
4. **Review and Refine**: After generation, review the documents and ask for specific updates or corrections as needed

## **Example Customization**

For a form builder application:
- Replace `[PROJECT_NAME]` with "Form Builder & Submission Management System"
- Replace `[PROJECT_DESCRIPTION]` with "comprehensive enterprise-grade form creation, distribution, review, and analytics platform with 169+ industry-specific templates"

## **Best Practices**

- **Run in Phases**: You can generate one document at a time if preferred
- **Iterative Improvement**: Review and ask for updates to improve accuracy
- **Verification**: Cross-check generated content against actual application features
- **Maintenance**: Update documentation when making significant application changes

## **Additional Customization Options**

You can modify the prompt to:
- Focus on specific document types only
- Add industry-specific requirements
- Include additional documentation types
- Specify particular formatting preferences
- Add compliance or regulatory requirements

---

This prompt template ensures comprehensive, professional documentation that accurately represents your Lovable project and provides value to all stakeholders.