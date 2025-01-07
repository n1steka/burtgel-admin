"use client";
import React from "react";
import { useParams } from "next/navigation";
import { CategoryProduct } from "@/components/CreateProduct/CategoryProduct";
type Props = {};

export default function Page({}: Props) {
  const { id } = useParams();
  return (
    <div>
      <CategoryProduct id={id} isCategory={true} />
    </div>
  );
}
