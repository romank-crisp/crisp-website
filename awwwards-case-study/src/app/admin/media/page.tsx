"use client";

import { MediaGallery } from "@/components/admin/MediaGallery";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";

const EMPTY_TREE: TreeGroup[] = [];

export default function MediaPage() {
    return (
        <AdminLayout
            treeGroups={EMPTY_TREE}
            activeTreeId=""
            onTreeSelect={() => {}}
            contentHeader="Media Gallery"
            contentSubheader="Browse, upload, and manage media files"
        >
            <MediaGallery />
        </AdminLayout>
    );
}
