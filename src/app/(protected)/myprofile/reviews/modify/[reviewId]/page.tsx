import ReviewCreateFormContainer from "@/components/review/ReviewCreateFormContainer";

export default async function ModifyPostpage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <ReviewCreateFormContainer type="modify" />
    </div>
  );
}
