import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex w-full h-full items-center justify-center bg-black select-none">
      <Image
        src="https://http.cat/404.jpg"
        alt="404 error"
        width={750}
        height={600}
        draggable={false}
      />
    </div>
  );
}
