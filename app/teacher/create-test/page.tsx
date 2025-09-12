"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface Column {
  id: string
  name: string
  dataType: string
  nullable: boolean
  primaryKey: boolean
}

export default function CreateTest() {
  const [testTitle, setTestTitle] = useState("")
  const [testDescription, setTestDescription] = useState("")
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<Column[]>([
    { id: "1", name: "", dataType: "VARCHAR(255)", nullable: false, primaryKey: false },
  ])

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: "",
      dataType: "VARCHAR(255)",
      nullable: false,
      primaryKey: false,
    }
    setColumns([...columns, newColumn])
  }

  const removeColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id))
  }

  const updateColumn = (id: string, field: keyof Column, value: any) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, [field]: value } : col)))
  }

  const handleCreateTest = () => {
    // Placeholder for backend integration
    alert("Test created successfully! (Backend integration pending)")
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
            <p className="text-sm text-[#d4d4d4]">Define table schema and test parameters</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
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

          {/* Table Schema Definition */}
          <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#2d2d2d]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Table Schema</h2>
              <Button onClick={addColumn} size="sm" className="bg-[#2563eb] hover:bg-[#3b82f6] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Column
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="tableName" className="text-[#d4d4d4]">
                  Table Name
                </Label>
                <Input
                  id="tableName"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="e.g., employees, products, orders"
                  className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666] mt-1"
                />
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 text-sm font-medium text-[#d4d4d4] px-2">
                  <div className="col-span-3">Column Name</div>
                  <div className="col-span-3">Data Type</div>
                  <div className="col-span-2">Nullable</div>
                  <div className="col-span-2">Primary Key</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {columns.map((column) => (
                  <div key={column.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-3">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, "name", e.target.value)}
                        placeholder="Column name"
                        className="bg-black border-[#2d2d2d] text-white placeholder:text-[#666]"
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={column.dataType}
                        onValueChange={(value) => updateColumn(column.id, "dataType", value)}
                      >
                        <SelectTrigger className="bg-black border-[#2d2d2d] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                          <SelectItem value="VARCHAR(255)" className="text-white">
                            VARCHAR(255)
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
                          <SelectItem value="DATE" className="text-white">
                            DATE
                          </SelectItem>
                          <SelectItem value="DATETIME" className="text-white">
                            DATETIME
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
                    <div className="col-span-2">
                      <Select
                        value={column.nullable.toString()}
                        onValueChange={(value) => updateColumn(column.id, "nullable", value === "true")}
                      >
                        <SelectTrigger className="bg-black border-[#2d2d2d] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                          <SelectItem value="false" className="text-white">
                            NOT NULL
                          </SelectItem>
                          <SelectItem value="true" className="text-white">
                            NULL
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={column.primaryKey.toString()}
                        onValueChange={(value) => updateColumn(column.id, "primaryKey", value === "true")}
                      >
                        <SelectTrigger className="bg-black border-[#2d2d2d] text-white">
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
                      <Button
                        onClick={() => removeColumn(column.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        disabled={columns.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleCreateTest}
              size="lg"
              className="bg-[#2563eb] hover:bg-[#3b82f6] text-white px-8 py-3 text-lg font-semibold"
              disabled={!testTitle || !tableName || columns.some((col) => !col.name)}
            >
              Create Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
