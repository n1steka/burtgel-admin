"use client";
import React from "react";
import { CategoryProduct } from "@/components/CreateProduct/CategoryProduct";
import { useParams } from "next/navigation";
type Props = {};

export default function Page({}: Props) {
  const { id } = useParams();

  return (
    <div>
      <CategoryProduct id={id} isCategory={false} />
    </div>
  );
}
