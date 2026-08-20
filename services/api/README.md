Here is a **clear domain map** of what you’ve built vs what remains.

---

# ✅ **WHAT YOU HAVE BUILT**

## 1. Geo Domain

- Geographic hierarchy (geo units)
- Geo levels
- Boundaries (implicitly modeled)
- Geo statistics (indicators, periods, values)

---

## 2. Constitution Domain

- Constitution
- Articles + sections (chapters, clauses, sub-clauses)
- Temporal versioning
- Amendments
- Lineage (previous versions)

---

## 3. Laws / Legal Domain

- Laws / Acts
- Law versions (temporal)
- Link laws → constitution sections
- Legal authority mapping

👉 This is the **bridge between constitution and real governance**

---

## 4. Governance / Political Structure

- Government offices
- Office hierarchy
- Powers / responsibilities
- Office holders (people in office)

👉 Defines **who has authority**

---

## 5. Elections Domain

- Elections (events)
- Electoral positions (seats)
- Candidates
- Results

👉 Defines **how people get into power**

---

## 6. People Domain

- People (citizens, officials)
- Identity + status
- Life-cycle (alive/deceased)

👉 The **human layer**

---

## 7. Political Parties Domain

- Parties
- Party membership
- Party ideology / structure

👉 Political organization layer

---

## 8. Finance (later)

- Budget
- Expenditure
- Revenue
- Public spending

---

## 9. Tenders / Procurement (later)

- Tenders
- Bids
- Contracts

---

# 🟡 **WHAT YOU SHOULD BUILD NEXT (CRITICAL DOMAINS)**

## 10. Public Participation / Civic Layer

- Petitions
- Feedback
- Citizen engagement

---

## 11. Transparency / Audit Layer

- Audit logs
- Change tracking across all domains
- Verification systems

---

# 🧠 **MASTER STRUCTURE (HOW IT ALL CONNECTS)**

```text id="full"
Constitution
   ↓
Laws
   ↓
Offices
   ↓
People
   ↓
Elections / Appointments
   ↓
Actions (later: finance, governance decisions)
```

---

NB: RULES: never add a field id or foreign key id, the strong codes system will handle relationships:
The Universal URI-Safe Hierarchy Standard requires lowercase, alphanumeric codes utilizing hyphens for spaces 
and slashes for nesting, while omitting redundant descriptors and numeric IDs. The hierarchy follows 
a parent/child pattern, exemplified by structures like ke/uasin-gishu/kapseret/langas.

ENUM FORMATTING RULES:
- Use UPPER_SNAKE_CASE for enum class names
- Use LOWER_SNAKE_CASE for enum values
- Keep enum values short and descriptive
- Group related enum values logically
- Add docstring with examples for each enum
- Import enums explicitly where used
