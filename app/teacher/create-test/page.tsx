"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Database, LinkIcon, Eye, EyeOff, ChevronDown, ChevronUp, User } from "lucide-react"
import { useState, useCallback, useMemo } from "react"

interface Column {
  id: string
  name: string
  dataType: string
  nullable: boolean
  primaryKey: boolean
  unique: boolean
  defaultValue: string
}

interface ForeignKey {
  id: string
  columnName: string
  referencedTable: string
  referencedColumn: string
}

interface Table {
  id: string
  name: string
  columns: Column[]
  foreignKeys: ForeignKey[]
  isExpanded: boolean
}

// Common data types for quick selection
const DATA_TYPES = [
  "VARCHAR(255)", "VARCHAR(100)", "VARCHAR(50)", 
  "INT", "BIGINT", "DECIMAL(10,2)", "DECIMAL(5,2)",
  "DATE", "DATETIME", "TIMESTAMP", "BOOLEAN", "TEXT"
]

export default function CreateTest() {
  const [testTitle, setTestTitle] = useState("")
  const [testDescription, setTestDescription] = useState("")
  const [teacherId, setTeacherId] = useState("1") // Default to 1
  const [tables, setTables] = useState<Table[]>([
    {
      id: "1",
      name: "",
      columns: [
        {
          id: "1",
          name: "",
          dataType: "VARCHAR(255)",
          nullable: false,
          primaryKey: false,
          unique: false,
          defaultValue: "",
        },
      ],
      foreignKeys: [],
      isExpanded: true,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Memoized validation
  const isValidForm = useMemo(() => {
    const hasValidTitle = testTitle.trim().length > 0
    const hasValidTeacherId = teacherId.trim().length > 0 && !isNaN(Number(teacherId))
    const hasValidTables = tables.every(
      table => table.name.trim() !== "" && 
      table.columns.length > 0 && 
      table.columns.every(col => col.name.trim() !== "")
    )
    return hasValidTitle && hasValidTeacherId && hasValidTables
  }, [testTitle, teacherId, tables])

  // Get available columns for foreign key selection
  const getAvailableColumns = useCallback((table: Table) => {
    return table.columns.filter(col => col.name.trim() !== "")
  }, [])

  // Get available tables for foreign key reference
  const getAvailableTables = useCallback((currentTableId: string) => {
    return tables.filter(table => 
      table.id !== currentTableId && table.name.trim() !== ""
    )
  }, [tables])

  // Optimized table operations
  const addTable = useCallback(() => {
    const newTable: Table = {
      id: Date.now().toString(),
      name: "",
      columns: [
        {
          id: Date.now().toString(),
          name: "",
          dataType: "VARCHAR(255)",
          nullable: false,
          primaryKey: false,
          unique: false,
          defaultValue: "",
        },
      ],
      foreignKeys: [],
      isExpanded: true,
    }
    setTables(prev => [...prev, newTable])
  }, [])

  const removeTable = useCallback((tableId: string) => {
    if (tables.length === 1) return
    setTables(prev => prev.filter(table => table.id !== tableId))
  }, [tables.length])

  const toggleTableExpansion = useCallback((tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, isExpanded: !table.isExpanded } : table
    ))
  }, [])

  const updateTable = useCallback((tableId: string, field: keyof Table, value: any) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, [field]: value } : table
    ))
  }, [])

  // Optimized column operations
  const addColumn = useCallback((tableId: string) => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: "",
      dataType: "VARCHAR(255)",
      nullable: false,
      primaryKey: false,
      unique: false,
      defaultValue: "",
    }
    setTables(prev => prev.map(table => 
      table.id === tableId ? { 
        ...table, 
        columns: [...table.columns, newColumn] 
      } : table
    ))
  }, [])

  const removeColumn = useCallback((tableId: string, columnId: string) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? { 
        ...table, 
        columns: table.columns.filter(col => col.id !== columnId) 
      } : table
    ))
  }, [])

  const updateColumn = useCallback((tableId: string, columnId: string, field: keyof Column, value: any) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? {
        ...table,
        columns: table.columns.map(col => 
          col.id === columnId ? { ...col, [field]: value } : col
        ),
      } : table
    ))
  }, [])

  // Optimized foreign key operations
  const addForeignKey = useCallback((tableId: string) => {
    const newForeignKey: ForeignKey = {
      id: Date.now().toString(),
      columnName: "select-column", // Default non-empty value
      referencedTable: "select-table", // Default non-empty value
      referencedColumn: "",
    }
    setTables(prev => prev.map(table =>
      table.id === tableId ? { 
        ...table, 
        foreignKeys: [...table.foreignKeys, newForeignKey] 
      } : table
    ))
  }, [])

  const removeForeignKey = useCallback((tableId: string, fkId: string) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? { 
        ...table, 
        foreignKeys: table.foreignKeys.filter(fk => fk.id !== fkId) 
      } : table
    ))
  }, [])

  const updateForeignKey = useCallback((tableId: string, fkId: string, field: keyof ForeignKey, value: any) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? {
        ...table,
        foreignKeys: table.foreignKeys.map(fk => 
          fk.id === fkId ? { ...fk, [field]: value } : fk
        ),
      } : table
    ))
  }, [])

  // Quick actions for common column configurations
  const setAsPrimaryKey = useCallback((tableId: string, columnId: string) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? {
        ...table,
        columns: table.columns.map(col => ({
          ...col,
          primaryKey: col.id === columnId,
          nullable: col.id === columnId ? false : col.nullable
        }))
      } : table
    ))
  }, [])

const handleCreateTest = async () => {
  if (!isValidForm) return;

  setIsSubmitting(true);

  try {
    // Generate a local temporary testId (timestamp-based)
    const tempTestId = Date.now();

    // Filter out foreign keys with placeholder values
    const cleanedTables = tables.map(table => ({
      ...table,
      foreignKeys: table.foreignKeys.filter(
        fk =>
          fk.columnName !== "select-column" &&
          fk.referencedTable !== "select-table" &&
          fk.columnName.trim() !== "" &&
          fk.referencedTable.trim() !== "" &&
          fk.referencedColumn.trim() !== ""
      )
    }));

    // Generate SQL schema with suffix
    const schemaSQL = generateSchemaSQL(cleanedTables, tempTestId);

    // Prepare payload for backend
    const payload = {
      teacher_id: parseInt(teacherId),
      test_name: testTitle,
      description: testDescription,
      schema: schemaSQL.join("\n\n"), // Send as single string
      num_questions: 10
    };

    console.log("Payload ready for backend:", payload);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const apiUrl = `${backendUrl}/teacher/upload`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResp = await response.text();
      throw new Error(`Backend returned non-JSON: ${textResp.substring(0, 200)}`);
    }

    const result = await response.json();

    if (!response.ok) throw new Error(result.detail || "Backend error");

    console.log("Backend response:", result);

    // Save locally with backend testId
    const testData = {
      id: result.test_id,
      title: testTitle,
      description: testDescription,
      teacher_id: parseInt(teacherId),
      tables: cleanedTables.map(({ isExpanded, ...table }) => table),
      createdAt: new Date().toISOString(),
      status: "Active",
      backend_id: result.test_id,
      table_name: result.table_name,
      schema_sql: payload.schema,
    };

    const existingTests = JSON.parse(localStorage.getItem("createdTests") || "[]");
    existingTests.push(testData);
    localStorage.setItem("createdTests", JSON.stringify(existingTests));

    // Reset form
    setTestTitle("");
    setTestDescription("");
    setTeacherId("1");
    setTables([
      {
        id: "1",
        name: "",
        columns: [{ id: "1", name: "", dataType: "VARCHAR(255)", nullable: false, primaryKey: false, unique: false, defaultValue: "" }],
        foreignKeys: [],
        isExpanded: true,
      },
    ]);

    alert("Test created successfully!");
  } catch (error) {
    console.error("Failed to create test:", error);
    alert(error instanceof Error ? error.message : "Failed to create test. Try again.");
  } finally {
    setIsSubmitting(false);
  }
};


// Improved SQL generation with proper suffix handling
// Converts tables to SQL DDL statements safely
// Converts tables to SQL DDL statements, with proper ordering and suffix
const generateSchemaSQL = (tables: Table[], testId: number): string[] => {
  if (!testId) throw new Error("testId is required for consistent suffixing");

  // Create a map for quick access
  const tableMap = new Map(tables.map(t => [t.name, t]));

  // Topological sort to handle foreign key dependencies
  const visited = new Set<string>();
  const sortedTables: Table[] = [];

  const visit = (table: Table) => {
    if (visited.has(table.name)) return;
    visited.add(table.name);

    table.foreignKeys.forEach(fk => {
      const refTable = tableMap.get(fk.referencedTable);
      if (refTable) visit(refTable);
    });

    sortedTables.push(table);
  };

  tables.forEach(visit);

  return sortedTables.map(table => {
    if (!table.name.trim()) throw new Error("All tables must have a name");

    const tableName = `"${table.name}_${testId}"`;

    // Columns
    const columnDefs = table.columns.map(col => {
      if (!col.name.trim()) throw new Error("All columns must have a name");
      let def = `"${col.name}" ${col.dataType}`;
      if (!col.nullable) def += " NOT NULL";
      if (col.unique) def += " UNIQUE";
      if (col.defaultValue.trim()) def += ` DEFAULT ${formatDefaultValue(col.defaultValue, col.dataType)}`;
      return def;
    });

    // Primary key
    const pkCols = table.columns.filter(c => c.primaryKey).map(c => `"${c.name}"`);
    if (pkCols.length > 0) columnDefs.push(`PRIMARY KEY (${pkCols.join(", ")})`);

    // Foreign keys
    const fkDefs = table.foreignKeys.map(fk => {
      const refTableName = `"${fk.referencedTable}_${testId}"`;
      return `FOREIGN KEY ("${fk.columnName}") REFERENCES ${refTableName}("${fk.referencedColumn}")`;
    });

    return `CREATE TABLE ${tableName} (\n  ${[...columnDefs, ...fkDefs].join(",\n  ")}\n);`;
  });
}

// Default value formatting
const formatDefaultValue = (value: string, dataType: string) => {
  if (!value.trim()) return "''";
  if (dataType.includes("CHAR") || dataType.includes("TEXT")) return `'${value.replace(/'/g, "''")}'`;
  if (dataType === "BOOLEAN") return value.toLowerCase() === "true" ? "TRUE" : "FALSE";
  return value;
}


  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-[#2d2d2d] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/teacher">
              <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Test</h1>
              <p className="text-sm text-[#d4d4d4]">Design your database schema with tables and relationships</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Test Information Card */}
          <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#2d2d2d] shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Test Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacherId" className="text-[#d4d4d4] text-sm font-medium">
                  Teacher ID *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <Input
                    id="teacherId"
                    type="number"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="Enter teacher ID"
                    className="bg-[#0f0f0f] border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-blue-500 transition-colors pl-10"
                    min="1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#d4d4d4] text-sm font-medium">
                  Test Title *
                </Label>
                <Input
                  id="title"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g., SQL Joins and Aggregations"
                  className="bg-[#0f0f0f] border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#d4d4d4] text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="description"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="Brief description of the test..."
                  className="bg-[#0f0f0f] border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Database Schema Section */}
          <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#2d2d2d] shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Database Schema</h2>
                  <p className="text-sm text-[#d4d4d4]">
                    {tables.length} table{tables.length !== 1 ? "s" : ""} defined
                  </p>
                </div>
              </div>
              <Button 
                onClick={addTable} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </div>

            {/* Tables List */}
            <div className="space-y-4">
              {tables.map((table, tableIndex) => {
                const availableColumns = getAvailableColumns(table)
                const availableTables = getAvailableTables(table.id)
                
                return (
                  <div key={table.id} className="bg-[#0f0f0f] rounded-lg border border-[#2d2d2d] overflow-hidden">
                    {/* Table Header */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                      onClick={() => toggleTableExpansion(table.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {table.isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#d4d4d4]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#d4d4d4]" />
                          )}
                          <h3 className="text-lg font-semibold text-white">
                            {table.name || `Table ${tableIndex + 1}`}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <span>{table.columns.length} columns</span>
                          {table.foreignKeys.length > 0 && (
                            <span>{table.foreignKeys.length} foreign keys</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTableExpansion(table.id)
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-[#d4d4d4] hover:text-white"
                        >
                          {table.isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        {tables.length > 1 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeTable(table.id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Table Content */}
                    {table.isExpanded && (
                      <div className="p-4 space-y-6 border-t border-[#2d2d2d]">
                        {/* Table Name */}
                        <div className="space-y-2">
                          <Label className="text-[#d4d4d4] text-sm font-medium">Table Name *</Label>
                          <Input
                            value={table.name}
                            onChange={(e) => updateTable(table.id, "name", e.target.value)}
                            placeholder="e.g., employees, products, orders"
                            className="bg-[#1a1a1a] border-[#2d2d2d] text-white placeholder:text-[#666] focus:border-blue-500 transition-colors"
                          />
                        </div>

                        {/* Columns Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium">Columns</h4>
                            <Button
                              onClick={() => addColumn(table.id)}
                              size="sm"
                              variant="outline"
                              className="border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d] transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Column
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {table.columns.map((column, columnIndex) => (
                              <div key={column.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start p-3 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d]">
                                {/* Column Name */}
                                <div className="lg:col-span-3 space-y-2">
                                  <Label className="text-xs text-[#888]">Column Name</Label>
                                  <Input
                                    value={column.name}
                                    onChange={(e) => updateColumn(table.id, column.id, "name", e.target.value)}
                                    placeholder={`column_${columnIndex + 1}`}
                                    className="bg-[#0f0f0f] border-[#2d2d2d] text-white text-sm h-9"
                                  />
                                </div>

                                {/* Data Type */}
                                <div className="lg:col-span-2 space-y-2">
                                  <Label className="text-xs text-[#888]">Data Type</Label>
                                  <Select
                                    value={column.dataType}
                                    onValueChange={(value) => updateColumn(table.id, column.id, "dataType", value)}
                                  >
                                    <SelectTrigger className="bg-[#0f0f0f] border-[#2d2d2d] text-white text-sm h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d] max-h-60">
                                      {DATA_TYPES.map(type => (
                                        <SelectItem key={type} value={type} className="text-white">
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Constraints */}
                                <div className="lg:col-span-4 space-y-2">
                                  <Label className="text-xs text-[#888]">Constraints</Label>
                                  <div className="flex gap-2 flex-wrap">
                                    <Button
                                      type="button"
                                      variant={column.primaryKey ? "default" : "outline"}
                                      size="sm"
                                      className={`text-xs h-7 ${
                                        column.primaryKey 
                                          ? "bg-blue-600 hover:bg-blue-700" 
                                          : "border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d]"
                                      }`}
                                      onClick={() => setAsPrimaryKey(table.id, column.id)}
                                    >
                                      PK
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={column.unique ? "default" : "outline"}
                                      size="sm"
                                      className={`text-xs h-7 ${
                                        column.unique 
                                          ? "bg-purple-600 hover:bg-purple-700" 
                                          : "border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d]"
                                      }`}
                                      onClick={() => updateColumn(table.id, column.id, "unique", !column.unique)}
                                    >
                                      UQ
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={!column.nullable ? "default" : "outline"}
                                      size="sm"
                                      className={`text-xs h-7 ${
                                        !column.nullable 
                                          ? "bg-red-600 hover:bg-red-700" 
                                          : "border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d]"
                                      }`}
                                      onClick={() => updateColumn(table.id, column.id, "nullable", !column.nullable)}
                                    >
                                      NN
                                    </Button>
                                  </div>
                                </div>

                                {/* Default Value */}
                                <div className="lg:col-span-2 space-y-2">
                                  <Label className="text-xs text-[#888]">Default</Label>
                                  <Input
                                    value={column.defaultValue}
                                    onChange={(e) => updateColumn(table.id, column.id, "defaultValue", e.target.value)}
                                    placeholder="NULL"
                                    className="bg-[#0f0f0f] border-[#2d2d2d] text-white text-sm h-9"
                                  />
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-1 space-y-2">
                                  <Label className="text-xs text-[#888] invisible">Actions</Label>
                                  <Button
                                    onClick={() => removeColumn(table.id, column.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-9 w-9 p-0"
                                    disabled={table.columns.length === 1}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Foreign Keys Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium">Foreign Keys</h4>
                            <Button
                              onClick={() => addForeignKey(table.id)}
                              size="sm"
                              variant="outline"
                              className="border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#2d2d2d] transition-colors"
                              disabled={availableColumns.length === 0 || availableTables.length === 0}
                            >
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Add Foreign Key
                            </Button>
                          </div>

                          {table.foreignKeys.length > 0 ? (
                            <div className="space-y-3">
                              {table.foreignKeys.map((fk) => (
                                <div key={fk.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center p-3 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d]">
                                  <div className="lg:col-span-3 space-y-2">
                                    <Label className="text-xs text-[#888]">Column</Label>
                                    <Select
                                      value={fk.columnName}
                                      onValueChange={(value) => updateForeignKey(table.id, fk.id, "columnName", value)}
                                    >
                                      <SelectTrigger className="bg-[#0f0f0f] border-[#2d2d2d] text-white text-sm h-9">
                                        <SelectValue placeholder="Select column" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                        <SelectItem value="select-column" className="text-gray-500">
                                          Select a column
                                        </SelectItem>
                                        {availableColumns.map((col) => (
                                          <SelectItem key={col.id} value={col.name} className="text-white">
                                            {col.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="lg:col-span-3 space-y-2">
                                    <Label className="text-xs text-[#888]">Referenced Table</Label>
                                    <Select
                                      value={fk.referencedTable}
                                      onValueChange={(value) => updateForeignKey(table.id, fk.id, "referencedTable", value)}
                                    >
                                      <SelectTrigger className="bg-[#0f0f0f] border-[#2d2d2d] text-white text-sm h-9">
                                        <SelectValue placeholder="Select table" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                        <SelectItem value="select-table" className="text-gray-500">
                                          Select a table
                                        </SelectItem>
                                        {availableTables.map((t) => (
                                          <SelectItem key={t.id} value={t.name} className="text-white">
                                            {t.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="lg:col-span-3 space-y-2">
                                    <Label className="text-xs text-[#888]">Referenced Column</Label>
                                    <Input
                                      value={fk.referencedColumn}
                                      onChange={(e) => updateForeignKey(table.id, fk.id, "referencedColumn", e.target.value)}
                                      placeholder="id"
                                      className="bg-[#0f0f0f] border-[#2d2d2d] text-white text-sm h-9"
                                    />
                                  </div>
                                  <div className="lg:col-span-3 space-y-2">
                                    <Label className="text-xs text-[#888] invisible">Actions</Label>
                                    <Button
                                      onClick={() => removeForeignKey(table.id, fk.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-9"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-[#666] border-2 border-dashed border-[#2d2d2d] rounded-lg">
                              <LinkIcon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">No foreign keys defined</p>
                              <p className="text-xs mt-1">Add relationships between tables</p>
                              {availableColumns.length === 0 && (
                                <p className="text-xs text-yellow-500 mt-2">Add named columns first</p>
                              )}
                              {availableTables.length === 0 && (
                                <p className="text-xs text-yellow-500 mt-2">Add other named tables first</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-end sticky bottom-4">
            <Button
              onClick={handleCreateTest}
              size="lg"
              disabled={!isValidForm || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}