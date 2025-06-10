<template>
  <div>
    <dialog class="modal" ref="about">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Rumor Party Line</h3>
        <p class="py-4">Let's spread some rumors!</p>
        <p class="py-1">
          <small><a href="https://github.com/pedroCX486/rumor-party-line">Created by pedroCX486 - <u>GitHub Repo</u></a></small>
        </p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>

    <div class="navbar bg-base-300 rounded-box">
      <div class="flex-1 px-2 lg:flex-none">
        <a class="text-lg font-bold">Rumor Party Line</a>
      </div>
      <div class="flex flex-1 justify-end px-2">
        <div class="flex items-stretch">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">Menu</div>
            <ul
                tabindex="0"
                class="menu dropdown-content bg-base-300 rounded-box z-[1] mt-4 w-52 p-2 shadow">
              <li>
                <RouterLink to="/">Home</RouterLink>
              </li>
              <li v-if="!isProd">
                <RouterLink to="/admin">Admin</RouterLink>
              </li>
            </ul>
          </div>
          <a class="btn btn-ghost rounded-btn" @click="about.showModal()">About</a>
        </div>
      </div>
    </div>

    <div class="h-screen flex flex-col items-center justify-center text-center">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from "vue";

const about = ref();
const isProd = ref(import.meta.env.PROD);
</script>