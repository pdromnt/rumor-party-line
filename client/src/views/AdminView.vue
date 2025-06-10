<script setup lang="ts">
import DeletePartyLines from "@/components/DeletePartyLines.vue";
import SendRumor from "@/components/SendRumor.vue";
import CreatePartyLine from "@/components/CreatePartyLine.vue";
</script>

<template>
  <div class="w-screen text-center grid grid-cols-1 grid-rows-3 gap-3">
    <CreatePartyLine/>
    <SendRumor/>
    <DeletePartyLines/>
  </div>
</template>