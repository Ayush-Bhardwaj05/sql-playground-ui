"use client"

interface QueryResult {
  success: boolean
  results: any[] | null
  error: string | null
  executionTime: number
  isCorrect?: boolean
  feedback?: string
}

interface Question {
  id: number
  expectedOutput: any[]
  schema: {
    tables: Array<{
      name: string
      columns: Array<{
        name: string
        type: string
        constraints: string
      }>
    }>
  }
  sampleData: Record<string, any[]>
}

export class QueryVerifier {
  static verifyQuery(query: string, question: Question): QueryResult {
    const startTime = performance.now()

    try {
      // Basic SQL syntax validation
      const cleanQuery = query.trim().toLowerCase()

      if (!cleanQuery) {
        return {
          success: false,
          results: null,
          error: "Please enter a SQL query",
          executionTime: performance.now() - startTime,
        }
      }

      if (!cleanQuery.startsWith("select")) {
        return {
          success: false,
          results: null,
          error: "Only SELECT queries are supported in this test",
          executionTime: performance.now() - startTime,
        }
      }

      // Simulate query execution based on question type
      const result = this.executeQuery(cleanQuery, question)
      const executionTime = performance.now() - startTime + Math.random() * 50 // Add realistic delay

      return {
        ...result,
        executionTime,
      }
    } catch (error) {
      return {
        success: false,
        results: null,
        error: "SQL syntax error: " + (error as Error).message,
        executionTime: performance.now() - startTime,
      }
    }
  }

  private static executeQuery(query: string, question: Question): Omit<QueryResult, "executionTime"> {
    const { id, expectedOutput, sampleData } = question

    // Question-specific verification logic
    switch (id) {
      case 1: // Basic SELECT
        return this.verifyBasicSelect(query, sampleData, expectedOutput)

      case 2: // WHERE clause
        return this.verifyWhereClause(query, sampleData, expectedOutput)

      case 3: // JOIN operations
        return this.verifyJoinQuery(query, sampleData, expectedOutput)

      case 4: // GROUP BY and aggregation
        return this.verifyAggregationQuery(query, sampleData, expectedOutput)

      case 5: // Subqueries
        return this.verifySubquery(query, sampleData, expectedOutput)

      default:
        return {
          success: false,
          results: null,
          error: "Unknown question type",
        }
    }
  }

  private static verifyBasicSelect(
    query: string,
    sampleData: Record<string, any[]>,
    expectedOutput: any[],
  ): Omit<QueryResult, "executionTime"> {
    if (query.includes("select *") && query.includes("from students")) {
      return {
        success: true,
        results: sampleData.students,
        error: null,
        isCorrect: true,
        feedback: "Perfect! You correctly selected all columns from the students table.",
      }
    }

    if (query.includes("select") && query.includes("from students")) {
      // Partial credit for selecting from students table
      return {
        success: true,
        results: sampleData.students.map((student) => ({ name: student.name })), // Simulate partial selection
        error: null,
        isCorrect: false,
        feedback: "Good start! You're selecting from the students table, but make sure to select ALL columns using *.",
      }
    }

    return {
      success: false,
      results: null,
      error: "Query should select all columns from the 'students' table",
      isCorrect: false,
      feedback: "Try using SELECT * FROM students to get all columns.",
    }
  }

  private static verifyWhereClause(
    query: string,
    sampleData: Record<string, any[]>,
    expectedOutput: any[],
  ): Omit<QueryResult, "executionTime"> {
    if (query.includes("where") && query.includes("marks") && (query.includes("> 80") || query.includes(">80"))) {
      const filteredResults = sampleData.students.filter((student) => student.marks > 80)
      return {
        success: true,
        results: filteredResults,
        error: null,
        isCorrect: true,
        feedback: "Excellent! You correctly filtered students with marks greater than 80.",
      }
    }

    if (query.includes("where") && query.includes("marks")) {
      return {
        success: true,
        results: sampleData.students.filter((student) => student.marks > 75), // Simulate different threshold
        error: null,
        isCorrect: false,
        feedback: "You're using the WHERE clause with marks, but check the condition. It should be marks > 80.",
      }
    }

    if (query.includes("where")) {
      return {
        success: false,
        results: null,
        error: "WHERE clause should filter by marks > 80",
        isCorrect: false,
        feedback: "You have a WHERE clause, but you need to filter by marks > 80.",
      }
    }

    return {
      success: false,
      results: null,
      error: "Query should include a WHERE clause to filter students with marks > 80",
      isCorrect: false,
      feedback: "Don't forget to add a WHERE clause to filter the results.",
    }
  }

  private static verifyJoinQuery(
    query: string,
    sampleData: Record<string, any[]>,
    expectedOutput: any[],
  ): Omit<QueryResult, "executionTime"> {
    const hasJoin = query.includes("join") || query.includes("inner join")
    const hasStudentsTable = query.includes("students")
    const hasCoursesTable = query.includes("courses")
    const hasCorrectColumns = query.includes("s.name") && query.includes("c.course_name")

    if (hasJoin && hasStudentsTable && hasCoursesTable && hasCorrectColumns) {
      // Simulate JOIN result
      const joinedResults = sampleData.students.map((student) => {
        const course = sampleData.courses.find((c) => c.id === student.course_id)
        return {
          name: student.name,
          course_name: course?.course_name || "Unknown",
        }
      })

      return {
        success: true,
        results: joinedResults,
        error: null,
        isCorrect: true,
        feedback: "Perfect JOIN! You successfully combined students and courses tables.",
      }
    }

    if (hasJoin && (hasStudentsTable || hasCoursesTable)) {
      return {
        success: true,
        results: [{ name: "Partial Result", course_name: "Check JOIN condition" }],
        error: null,
        isCorrect: false,
        feedback: "You're using JOIN, but make sure to join students and courses tables on the correct foreign key.",
      }
    }

    return {
      success: false,
      results: null,
      error: "Query should use JOIN to combine students and courses tables",
      isCorrect: false,
      feedback:
        "You need to use JOIN to combine the students and courses tables. Try: SELECT s.name, c.course_name FROM students s JOIN courses c ON s.course_id = c.id",
    }
  }

  private static verifyAggregationQuery(
    query: string,
    sampleData: Record<string, any[]>,
    expectedOutput: any[],
  ): Omit<QueryResult, "executionTime"> {
    const hasGroupBy = query.includes("group by")
    const hasAvg = query.includes("avg")
    const hasHaving = query.includes("having")
    const hasJoin = query.includes("join")

    if (hasGroupBy && hasAvg && hasHaving && hasJoin) {
      // Simulate aggregation result
      const aggregatedResults = [
        { course_name: "Computer Science", average_marks: 82.0 },
        { course_name: "Mathematics", average_marks: 93.5 },
      ]

      return {
        success: true,
        results: aggregatedResults,
        error: null,
        isCorrect: true,
        feedback:
          "Excellent! You correctly used GROUP BY, AVG, and HAVING to find courses with average marks above 75.",
      }
    }

    if (hasGroupBy && hasAvg) {
      return {
        success: true,
        results: [
          { course_name: "Computer Science", average_marks: 82.0 },
          { course_name: "Mathematics", average_marks: 93.5 },
          { course_name: "Physics", average_marks: 80.0 },
        ],
        error: null,
        isCorrect: false,
        feedback: "Good use of GROUP BY and AVG! But you need HAVING clause to filter courses with average > 75.",
      }
    }

    return {
      success: false,
      results: null,
      error: "Query should use GROUP BY, AVG, and HAVING clauses",
      isCorrect: false,
      feedback:
        "This question requires aggregation. Use GROUP BY to group by course, AVG to calculate averages, and HAVING to filter results.",
    }
  }

  private static verifySubquery(
    query: string,
    sampleData: Record<string, any[]>,
    expectedOutput: any[],
  ): Omit<QueryResult, "executionTime"> {
    const hasSubquery = query.includes("(") && query.includes("select")
    const hasAvg = query.includes("avg")
    const hasComparison = query.includes(">") || query.includes("<")

    if (hasSubquery && hasAvg && hasComparison) {
      // Simulate subquery result
      const subqueryResults = [
        { name: "Alice Johnson", marks: 85.5, course_name: "Computer Science" },
        { name: "Eve Brown", marks: 95.0, course_name: "Mathematics" },
        { name: "David Wilson", marks: 88.0, course_name: "Physics" },
      ]

      return {
        success: true,
        results: subqueryResults,
        error: null,
        isCorrect: true,
        feedback: "Outstanding! You correctly used a subquery to compare student marks with course averages.",
      }
    }

    if (hasSubquery) {
      return {
        success: true,
        results: [{ name: "Partial", marks: 0, course_name: "Check subquery logic" }],
        error: null,
        isCorrect: false,
        feedback:
          "You're using a subquery, but make sure it calculates the average marks for each course and compares correctly.",
      }
    }

    return {
      success: false,
      results: null,
      error: "Query should use a subquery to compare with course averages",
      isCorrect: false,
      feedback:
        "This question requires a subquery. You need to compare each student's marks with the average marks of their course.",
    }
  }

  static getHint(questionId: number, currentQuery: string): string {
    const query = currentQuery.toLowerCase().trim()

    switch (questionId) {
      case 1:
        if (!query.includes("select")) return "Start with SELECT keyword"
        if (!query.includes("*")) return "Use * to select all columns"
        if (!query.includes("from")) return "Don't forget the FROM clause"
        return "You're close! Make sure you have: SELECT * FROM students"

      case 2:
        if (!query.includes("where")) return "You need a WHERE clause to filter results"
        if (!query.includes("marks")) return "Filter by the 'marks' column"
        if (!query.includes("80")) return "The condition should be marks > 80"
        return "Almost there! Check your comparison operator"

      case 3:
        if (!query.includes("join")) return "You need to JOIN two tables"
        if (!query.includes("students") || !query.includes("courses")) return "Join the students and courses tables"
        if (!query.includes("on")) return "Don't forget the ON clause for the join condition"
        return "Check your join condition - it should be ON s.course_id = c.id"

      case 4:
        if (!query.includes("group by")) return "Use GROUP BY to group results by course"
        if (!query.includes("avg")) return "Use AVG() function to calculate averages"
        if (!query.includes("having")) return "Use HAVING to filter grouped results (not WHERE)"
        return "Make sure to join tables and filter with HAVING AVG(marks) > 75"

      case 5:
        if (!query.includes("(")) return "You need a subquery (query inside parentheses)"
        if (!query.includes("avg")) return "The subquery should calculate average marks"
        return "Compare each student's marks with their course average using a subquery"

      default:
        return "Review the question requirements and try again"
    }
  }
}
