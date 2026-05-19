'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

interface WeeklyPoint {
  week: string
  docs: number
  pets: number
}

interface Props {
  weekly: WeeklyPoint[]
}

const DOCS_COLOR = '#71717a'
const PETS_COLOR = '#f43f5e'

export function AdminCharts({ weekly }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">Weekly activity</h2>
      <div className="border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekly} barGap={2} barCategoryGap="30%">
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: '#71717a' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#71717a' }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid hsl(240 3.7% 10%)',
                background: 'hsl(240 5% 4%)',
                color: '#fff',
              }}
              cursor={{ fill: 'hsl(240 3.7% 15%)', radius: 4 }}
            />
            <Bar dataKey="docs" name="Docs" fill={DOCS_COLOR} radius={[3, 3, 0, 0]} />
            <Bar dataKey="pets" name="Pets" fill={PETS_COLOR} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: DOCS_COLOR }} />
            Docs
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PETS_COLOR }} />
            Pets
          </span>
        </div>
      </div>
    </div>
  )
}
