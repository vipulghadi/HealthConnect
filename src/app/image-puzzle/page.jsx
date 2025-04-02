import { ImagePuzzleGame } from "@/components/client/common/image-puzzle-game";

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Image Puzzle Game</h1>
      <ImagePuzzleGame />
    </div>
  );
}
