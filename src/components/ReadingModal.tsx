import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ReadingTabs() {
  return (
    <>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="articles">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
          </TabsList>
          <TabsContent value="acount">
            <Card>
              <CardHeader>
                <CardTitle>Article</CardTitle>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
