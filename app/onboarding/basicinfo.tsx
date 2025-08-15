import CustomInputDate from "@/components/elements/CustomInputDate";
import CustomInputText from "@/components/elements/CustomInputText";
import CustomInputTextarea from "@/components/elements/CustomInputTextarea";
import CustomRadioButton from "@/components/elements/CustomRadioButton";
import { OnboardingScreenLayout } from "@/components/layouts/OnboardingScreenLayout";
import { HStack, Text, VStack } from "@/components/ui";
import { GENDER_TYPES } from "@/src/definitions/constants/GENDER_TYPES";
import { INTEREST_TYPES } from "@/src/definitions/constants/INTEREST_TYPES";
import { useOnboardingStore } from "@/src/presentation/stores/onboarding.store";
import { validateOnboardingStep } from "@/src/utils/validateOnboardingStep";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";

const BasicInfoScreen = () => {
  // Use correct onboarding store selectors
  const alias = useOnboardingStore((state) => state.alias);
  const setAlias = useOnboardingStore((state) => state.setAlias);
  const birthDate = useOnboardingStore((state) => state.birthDate);
  const setBirthDate = useOnboardingStore((state) => state.setBirthDate);
  const biography = useOnboardingStore((state) => state.biography);
  const setBiography = useOnboardingStore((state) => state.setBiography);
  const gender = useOnboardingStore((state) => state.gender);
  const setGender = useOnboardingStore((state) => state.setGender);
  const genderInterests = useOnboardingStore((state) => state.genderInterests);
  const setGenderInterests = useOnboardingStore((state) => state.setGenderInterests);

  const [isValidStep, setIsValidStep] = useState(false);

  const handleGenderSelect = (value: string | number) => {
    // Ensure value is a number for the store
    setGender(typeof value === "string" ? Number(value) : value);
  };

  const handleInterestSelect = (type: "male" | "female" | "both") => {
    switch (type) {
      case "male":
        setGenderInterests([INTEREST_TYPES.MALE]);
        break;
      case "female":
        setGenderInterests([INTEREST_TYPES.FEMALE]);
        break;
      case "both":
        setGenderInterests([INTEREST_TYPES.MALE, INTEREST_TYPES.FEMALE]);
        break;
    }
  };

  const getSelectedInterestType = () => {
    if (
      genderInterests.includes(INTEREST_TYPES.MALE) &&
      genderInterests.includes(INTEREST_TYPES.FEMALE)
    ) {
      return "both";
    }
    if (genderInterests.includes(INTEREST_TYPES.MALE)) {
      return "male";
    }
    if (genderInterests.includes(INTEREST_TYPES.FEMALE)) {
      return "female";
    }
    return null;
  };

  useEffect(() => {
    const checkValidation = async () => {
      const isValid = await validateOnboardingStep(2, {
        alias,
        birthDate,
        biography,
        gender,
        genderInterests,
      });
      setIsValidStep(isValid);
    };
    checkValidation();
  }, [alias, birthDate, biography, gender, genderInterests]);

  const handleContinue = async () => {
    const isValid = await validateOnboardingStep(2, {
      alias,
      birthDate,
      biography,
      gender,
      genderInterests,
    });
    if (isValid) {
      router.push("/onboarding/pictures");
    } else {
      Alert.alert(
        "Informacion Basica invalida",
        "Por favor complete su informacion personal correctamente"
      );
    }
  };

  return (
    <OnboardingScreenLayout
      showProgress
      progressValue={50}
      showBackButton
      isStepValidated={isValidStep}
      footerButtonText="Continuar"
      onFooterButtonPress={handleContinue}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-[#1B1B1F] mt-2">
          ¡Arma tu perfil en un toque!
        </Text>

        <VStack space="lg" className="mt-6">
          <CustomInputText
            label="Nombre a mostrar"
            value={alias}
            setValue={setAlias}
            placeholder="Tu Nombre"
          />

          <CustomInputDate
            label="Fecha de nacimiento"
            value={birthDate}
            setValue={setBirthDate}
            placeholder="DD/MM/AAAA"
          />

          <CustomInputTextarea
            label="Acerca de ti"
            value={biography}
            setValue={setBiography}
            placeholder="Descríbete para hacer nuevos amigos"
            maxLength={250}
          />

          <VStack className="mt-3">
            <Text className="text-[#35313D] mb-3 font-medium text-base">
              Tu Género
            </Text>
            <HStack space="xl" className="items-center">
              <CustomRadioButton
                label="Hombre"
                value={GENDER_TYPES.MALE}
                selectedValue={String(gender)}
                onSelect={handleGenderSelect}
              />
              <CustomRadioButton
                label="Mujer"
                value={GENDER_TYPES.FEMALE}
                selectedValue={String(gender)}
                onSelect={handleGenderSelect}
              />
            </HStack>
          </VStack>

          <VStack className="mt-3">
            <Text className="text-[#35313D] mb-3 font-medium text-base">
              Quiero conocer
            </Text>
            <HStack space="md">
              <CustomRadioButton
                label="Mujeres"
                value={INTEREST_TYPES.FEMALE}
                selectedValue={
                  getSelectedInterestType() === "female"
                    ? INTEREST_TYPES.FEMALE
                    : ""
                }
                onSelect={() => handleInterestSelect("female")}
              />
              <CustomRadioButton
                label="Hombres"
                value={INTEREST_TYPES.MALE}
                selectedValue={
                  getSelectedInterestType() === "male"
                    ? INTEREST_TYPES.MALE
                    : ""
                }
                onSelect={() => handleInterestSelect("male")}
              />
              <CustomRadioButton
                label="Ambos"
                value="both"
                selectedValue={
                  getSelectedInterestType() === "both" ? "both" : ""
                }
                onSelect={() => handleInterestSelect("both")}
              />
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </OnboardingScreenLayout>
  );
};

export default BasicInfoScreen;
