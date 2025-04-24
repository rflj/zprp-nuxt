<template>
  <UContainer>
    <UCard class="mt-10">
      <div class="flex justify-start grip gap-x-8">
        <div class="grid gap-y-2">
          <span class="text-sm font-bold">Sezon</span>
          <USelectMenu
              searchable
              searchable-placeholder="Wybierz sezon..."
              class="w-full lg:w-48"
              :options="optionsSezon"
              option-attribute="Nazwa"
              v-model="selectedSezon"
          />
        </div>
        <div class="grid gap-y-2">
          <span class="text-sm font-bold">Rozgrywki</span>
          <USelectMenu
              searchable
              searchable-placeholder="Wybierz rozgrywki..."
              class="w-full lg:w-48"
              :options="optionsRozgrywki"
              by="Id_rozgrywki"
              option-attribute="Nazwa"
              v-model="selectedRozgrywki"
          >
            <template #option="{ option: rozgrywka }">
              <span class="text-sm">
                <UBadge
                    size="xs"
                    :color="rozgrywka.Plec === 'K' ? 'red' : 'teal'"
                    variant="solid"
                    :label="rozgrywka.Plec"
                />
                {{ rozgrywka.Nazwa }}
              </span>
            </template>
          </USelectMenu>

        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <UButton @click="getFilterTerminarz()">Filtruj</UButton>
        </div>
      </template>
    </UCard>

  </UContainer>
  <UTable :columns="columns" :rows="matches" class="mt-10">
    <template #Sezon-data="{ row }">
      <UBadge variant="outline" :label="row.Sezon"/>
    </template>
    <template #RozgrywkiTypCode-data="{ row }">
      <UBadge
          size="sm"
          color="black"
          variant="outline"
          :label="row.RozgrywkiTypCode"
          :trailing="true"
      />
    </template>
    <template #DataGodzina-data="{ row }">
      <div class="flex flex-col justify-between">
        <small>
          <div class="font-bold">{{ row.ZawodyData }}</div>
          <div>({{ row.ZawodyGodzina }})</div>
        </small>
      </div>
    </template>
    <template #Sedziowie-data="{ row }">
      {{ row.NrSedzia_pierwszy_nazwisko }} - {{ row.NrSedzia_drugi_nazwisko }}
    </template>
  </UTable>
</template>

<script setup>
import axiosInstance from './services/axiosInstance';

const matches = ref([]);
const optionsSezon = ref([]);
const optionsRozgrywki = ref([]);
const selectedSezon = ref();
const selectedRozgrywki = ref(optionsRozgrywki[0]);

async function getSezony() {
  axiosInstance.get(`pokaz_sezony.php`)
      .then((response) => {
        optionsSezon.value = Object.values(response.data);
        selectedSezon.value = optionsSezon.value.find(item => item.Stan === "1")
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("Sezony >> ")
        console.log(optionsSezon.value)
        console.log(`Wybrany Sezon >> [${selectedSezon.value["ID_sezon"]}] ${selectedSezon.value["Nazwa"]}`)
        getRozgrywki()
      })
}

async function getRozgrywki() {
  axiosInstance.get(`pokaz_rozgrywki.php?Sezon=${selectedSezon.value["ID_sezon"]}`)
      .then((response) => {
        optionsRozgrywki.value = Object.values(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("Rozgrywki >> ")
        console.log(optionsRozgrywki.value)
      })
}

async function getTodayMatches() {
  axiosInstance.get(`pokaz_terminarz.php`)
      .then((response) => {
        console.log(response.data)
        matches.value = Object.values(response.data);
        console.log(response.data)
        // console.log(loading.value)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        console.log(matches)
        // loading.value = false;
      })
}

async function getFilterTerminarz() {
  console.log(`Selected Rozgrywki >> ${selectedRozgrywki.value["Id_rozgrywki"]}`);
  axiosInstance.get(`pokaz_terminarz.php?Rozgrywki=${selectedRozgrywki.value["Id_rozgrywki"]}`)
      .then((response) => {
        if (response.data) {
          matches.value = Object.values(response.data);
        }
        else {
          console.log("No matches")
          matches.value = []
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log(matches)
      })
}

const columns = [
  // {
  //   key: 'Sezon',
  //   label: 'Sezon',
  //   rowClass: 'text-xs'
  // },
  {
    key: 'RozgrywkiTypCode',
    label: 'Numer meczu',
    rowClass: 'text-xs'
  },
  {
    key: 'DataGodzina',
    label: 'Data i Godzina',
    rowClass: 'text-xs'
  },
  {
    key: 'ID_zespoly_gosp_ZespolNazwa',
    label: 'Gospodarz',
  },
  {
    key: 'ID_zespoly_gosc_ZespolNazwa',
    label: 'Gość',
  },
  {
    key: 'Sedziowie',
    label: 'Sedziowie',
    rowClass: 'text-xs'
  },
  {
    key: 'NrSedzia_delegat_nazwisko',
    label: 'Delegat',
    rowClass: 'text-xs'
  }
]

onMounted(() => {
  getTodayMatches()
  getSezony()
})
</script>