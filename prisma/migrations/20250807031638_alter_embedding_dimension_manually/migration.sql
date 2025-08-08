-- Thay đổi kiểu dữ liệu của cột embedding trong bảng KnowledgeChunk
ALTER TABLE "KnowledgeChunk" ALTER COLUMN "embedding" TYPE vector(768);