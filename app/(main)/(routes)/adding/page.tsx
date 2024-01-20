import ArticleForm from "@/components/forms/article/article-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Adding() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Add new article</CardTitle>
			</CardHeader>

			<CardContent>
				<ArticleForm />
			</CardContent>
		</Card>
	);
}
