"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Database, LinkIcon } from "lucide-react"
import { useState } from "react"

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
}

export default function CreateTest() {
  const [testTitle, setTestTitle] = useState("")
  const [testDescription, setTestDescription] = useState("")
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
    },
  ])

  const addTable = () => {
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
    }
    setTables([...tables, newTable])
  }

  const removeTable = (tableId: string) => {
    if (tables.length === 1) return
    setTables(tables.filter((table) => table.id !== tableId))
  }

  const updateTable = (tableId: string, field: keyof Table, value: any) => {
    setTables(tables.map((table) => (table.id === tableId ? { ...table, [field]: value } : table)))
  }

  const addColumn = (tableId: string) => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: "",
      dataType: "VARCHAR(255)",
      nullable: false,
      primaryKey: false,
      unique: false,
      defaultValue: "",
    }
    setTables(
      tables.map((table) => (table.id === tableId ? { ...table, columns: [...table.columns, newColumn] } : table)),
    )
  }

  const removeColumn = (tableId: string, columnId: string) => {
    setTables(
      tables.map((table) =>
        table.id === tableId ? { ...table, columns: table.columns.filter((col) => col.id !== columnId) } : table,
      ),
    )
  }

  const updateColumn = (tableId: string, columnId: string, field: keyof Column, value: any) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.map((col) => (col.id === columnId ? { ...col, [field]: value } : col)),
            }
          : table,
      ),
    )
  }

  const addForeignKey = (tableId: string) => {
    const newForeignKey: ForeignKey = {
      id: Date.now().toString(),
      columnName: "",
      referencedTable: "",
      referencedColumn: "",
    }
    setTables(
      tables.map((table) =>
        table.id === tableId ? { ...table, foreignKeys: [...table.foreignKeys, newForeignKey] } : table,
      ),
    )
  }

  const removeForeignKey = (tableId: string, fkId: string) => {
    setTables(
      tables.map((table) =>
        table.id === tableId ? { ...table, foreignKeys: table.foreignKeys.filter((fk) => fk.id !== fkId) } : table,
      ),
    )
  }

  const updateForeignKey = (tableId: string, fkId: string, field: keyof ForeignKey, value: any) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              foreignKeys: table.foreignKeys.map((fk) => (fk.id === fkId ? { ...fk, [field]: value } : fk)),
            }
          : table,
      ),
    )
  }

  const handleCreateTest = () => {
    // Validate all tables have names and at least one column
    const isValid = tables.every(
      (table) =>
        table.name.trim() !== "" && table.columns.length > 0 && table.columns.every((col) => col.name.trim() !== ""),
    )

    if (!isValid) {
      alert("Please ensure all tables have names and at least one named column.")
      return
    }

    // Save test to localStorage (dummy storage)
    const testData = {
      id: Date.now(),
      title: testTitle,
      description: testDescription,
      tables: tables,
      createdAt: new Date().toISOString(),
      status: "Active",
    }

    const existingTests = JSON.parse(localStorage.getItem("createdTests") || "[]")
    existingTests.push(testData)
    localStorage.setItem("createdTests", JSON.stringify(existingTests))

    alert("Test created successfully!")

    // Reset form
    setTestTitle("")
    setTestDescription("")
    setTables([
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
      },
    ])
  }

  return (
    <div className="min-h-screen bg-black flex flex-col px-4">
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-4">
          <Link href="/teacher">
            <Button variant="ghost" size="sm" className="text-[#d4d4d4] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Test</h1>
            <p className="text-sm text-[#d4d4d4]">Define multiple tables with relationships and constraints</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Test Information */}
          <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
            <h2 className="text-xl font-semibold text-white mb-4">Test Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#d4d4d4]">
                  Test Title
                </Label>
                <Input
                  id="title"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g., SQL Joins and Aggregations"
                  className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-[#d4d4d4]">
                  Test Description
                </Label>
                <Textarea
                  id="description"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="Describe what students will be tested on..."
                  className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] mt-1 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Database Schema */}
          <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Database Schema</h2>
                <span className="text-sm text-[#d4d4d4]">
                  ({tables.length} table{tables.length !== 1 ? "s" : ""})
                </span>
              </div>
              <Button onClick={addTable} size="sm" className="bg-[#2563eb] hover:bg-[#3b82f6] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </div>

            <div className="space-y-8">
              {tables.map((table, tableIndex) => (
                <div key={table.id} className="bg-[#0f0f0f] rounded-lg p-6 border border-[#2d2d2d]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">Table {tableIndex + 1}</h3>
                      {tables.length > 1 && (
                        <Button
                          onClick={() => removeTable(table.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => addColumn(table.id)}
                        size="sm"
                        variant="outline"
                        className="bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Column
                      </Button>
                      <Button
                        onClick={() => addForeignKey(table.id)}
                        size="sm"
                        variant="outline"
                        className="bg-[#2d2d2d] border-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d]"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Add Foreign Key
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#d4d4d4]">Table Name</Label>
                      <Input
                        value={table.name}
                        onChange={(e) => updateTable(table.id, "name", e.target.value)}
                        placeholder="e.g., employees, products, orders"
                        className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] mt-1"
                      />
                    </div>

                    {/* Columns */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Columns</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-[#d4d4d4] px-2">
                          <div className="col-span-2">Name</div>
                          <div className="col-span-2">Data Type</div>
                          <div className="col-span-1">Nullable</div>
                          <div className="col-span-1">Primary</div>
                          <div className="col-span-1">Unique</div>
                          <div className="col-span-2">Default</div>
                          <div className="col-span-2">Constraints</div>
                          <div className="col-span-1">Actions</div>
                        </div>

                        {table.columns.map((column) => (
                          <div key={column.id} className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-2">
                              <Input
                                value={column.name}
                                onChange={(e) => updateColumn(table.id, column.id, "name", e.target.value)}
                                placeholder="Column name"
                                className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <Select
                                value={column.dataType}
                                onValueChange={(value) => updateColumn(table.id, column.id, "dataType", value)}
                              >
                                <SelectTrigger className="bg-black border-[#2d2d2d] text-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                  <SelectItem value="VARCHAR(255)" className="text-white">
                                    VARCHAR(255)
                                  </SelectItem>
                                  <SelectItem value="VARCHAR(100)" className="text-white">
                                    VARCHAR(100)
                                  </SelectItem>
                                  <SelectItem value="VARCHAR(50)" className="text-white">
                                    VARCHAR(50)
                                  </SelectItem>
                                  <SelectItem value="INT" className="text-white">
                                    INT
                                  </SelectItem>
                                  <SelectItem value="BIGINT" className="text-white">
                                    BIGINT
                                  </SelectItem>
                                  <SelectItem value="DECIMAL(10,2)" className="text-white">
                                    DECIMAL(10,2)
                                  </SelectItem>
                                  <SelectItem value="DECIMAL(5,2)" className="text-white">
                                    DECIMAL(5,2)
                                  </SelectItem>
                                  <SelectItem value="DATE" className="text-white">
                                    DATE
                                  </SelectItem>
                                  <SelectItem value="DATETIME" className="text-white">
                                    DATETIME
                                  </SelectItem>
                                  <SelectItem value="TIMESTAMP" className="text-white">
                                    TIMESTAMP
                                  </SelectItem>
                                  <SelectItem value="BOOLEAN" className="text-white">
                                    BOOLEAN
                                  </SelectItem>
                                  <SelectItem value="TEXT" className="text-white">
                                    TEXT
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1">
                              <Select
                                value={column.nullable.toString()}
                                onValueChange={(value) =>
                                  updateColumn(table.id, column.id, "nullable", value === "true")
                                }
                              >
                                <SelectTrigger className="bg-black border-[#2d2d2d] text-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                  <SelectItem value="false" className="text-white">
                                    No
                                  </SelectItem>
                                  <SelectItem value="true" className="text-white">
                                    Yes
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1">
                              <Select
                                value={column.primaryKey.toString()}
                                onValueChange={(value) =>
                                  updateColumn(table.id, column.id, "primaryKey", value === "true")
                                }
                              >
                                <SelectTrigger className="bg-black border-[#2d2d2d] text-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                  <SelectItem value="false" className="text-white">
                                    No
                                  </SelectItem>
                                  <SelectItem value="true" className="text-white">
                                    Yes
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1">
                              <Select
                                value={column.unique.toString()}
                                onValueChange={(value) => updateColumn(table.id, column.id, "unique", value === "true")}
                              >
                                <SelectTrigger className="bg-black border-[#2d2d2d] text-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                  <SelectItem value="false" className="text-white">
                                    No
                                  </SelectItem>
                                  <SelectItem value="true" className="text-white">
                                    Yes
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Input
                                value={column.defaultValue}
                                onChange={(e) => updateColumn(table.id, column.id, "defaultValue", e.target.value)}
                                placeholder="Default value"
                                className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs text-[#d4d4d4]">
                                {column.primaryKey && <span className="bg-blue-600 px-2 py-1 rounded mr-1">PK</span>}
                                {column.unique && <span className="bg-purple-600 px-2 py-1 rounded mr-1">UQ</span>}
                                {!column.nullable && <span className="bg-red-600 px-2 py-1 rounded mr-1">NN</span>}
                              </div>
                            </div>
                            <div className="col-span-1">
                              <Button
                                onClick={() => removeColumn(table.id, column.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                                disabled={table.columns.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Foreign Keys */}
                    {table.foreignKeys.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-3">Foreign Keys</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-12 gap-3 text-sm font-medium text-[#d4d4d4] px-2">
                            <div className="col-span-3">Column</div>
                            <div className="col-span-3">Referenced Table</div>
                            <div className="col-span-3">Referenced Column</div>
                            <div className="col-span-3">Actions</div>
                          </div>

                          {table.foreignKeys.map((fk) => (
                            <div key={fk.id} className="grid grid-cols-12 gap-3 items-center">
                              <div className="col-span-3">
                                <Select
                                  value={fk.columnName}
                                  onValueChange={(value) => updateForeignKey(table.id, fk.id, "columnName", value)}
                                >
                                  <SelectTrigger className="bg-black border-[#2d2d2d] text-white text-sm">
                                    <SelectValue placeholder="Select column" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                    {table.columns.map((col) => (
                                      <SelectItem key={col.id} value={col.name} className="text-white">
                                        {col.name || "Unnamed column"}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-3">
                                <Select
                                  value={fk.referencedTable}
                                  onValueChange={(value) => updateForeignKey(table.id, fk.id, "referencedTable", value)}
                                >
                                  <SelectTrigger className="bg-black border-[#2d2d2d] text-white text-sm">
                                    <SelectValue placeholder="Select table" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                                    {tables
                                      .filter((t) => t.id !== table.id)
                                      .map((t) => (
                                        <SelectItem key={t.id} value={t.name} className="text-white">
                                          {t.name || "Unnamed table"}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-3">
                                <Input
                                  value={fk.referencedColumn}
                                  onChange={(e) =>
                                    updateForeignKey(table.id, fk.id, "referencedColumn", e.target.value)
                                  }
                                  placeholder="Referenced column"
                                  className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] text-sm"
                                />
                              </div>
                              <div className="col-span-3">
                                <Button
                                  onClick={() => removeForeignKey(table.id, fk.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleCreateTest}
              size="lg"
              className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-3 text-lg font-semibold"
              disabled={!testTitle || tables.some((table) => !table.name || table.columns.some((col) => !col.name))}
            >
              Create Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
