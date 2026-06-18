// import {
//   Box,
//   Card,
//   CircularProgress,
//   Divider,
//   Icon,
//   IconButton,
//   Stack,
//   SwipeableDrawer,
//   Typography,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";
// import type { VocabResponse } from "../../../api/Learnup/models/VocabResponse";

// type VocabExample = {
//   example: string;
//   translation: string;
//   note?: string | null;
// };

// type VocabDetailViewModel = {
//   word: string;
//   meaning: string;
//   description: string;
//   examples: VocabExample[];
// };

// type Props = {
//   vocabs?: Array<Pick<VocabResponse, "id" | "word">>;
//   getVocabDetail?: (
//     word: string,
//   ) => Promise<VocabDetailResponse | VocabDetailViewModel>;
//   open?: boolean;
//   selectedWord?: string | null;
//   onClose?: () => void;
//   hideTriggerList?: boolean;
// };

// const placeholderWords: Array<Pick<VocabResponse, "id" | "word">> = [
//   { id: 1, word: "curious" },
//   { id: 2, word: "journey" },
//   { id: 3, word: "careful" },
// ];

// const placeholderDetails: Record<string, VocabDetailViewModel> = {
//   curious: {
//     word: "curious",
//     meaning: "کنجکاو",
//     description:
//       "Used for someone who wants to know more about people, ideas, or situations.",
//     examples: [
//       {
//         example: "She was curious about how the machine worked.",
//         translation: "او کنجکاو بود بداند دستگاه چگونه کار می کند.",
//         note: "Common in daily conversation and reading texts.",
//       },
//       {
//         example: "Children are naturally curious about the world.",
//         translation: "کودکان ذاتا درباره دنیا کنجکاو هستند.",
//       },
//     ],
//   },
//   journey: {
//     word: "journey",
//     meaning: "سفر",
//     description:
//       "A trip from one place to another, often used for a longer or meaningful travel experience.",
//     examples: [
//       {
//         example: "The journey took nearly six hours by train.",
//         translation: "این سفر با قطار تقریبا شش ساعت طول کشید.",
//       },
//       {
//         example: "Learning English is a long journey.",
//         translation: "یادگیری انگلیسی یک مسیر طولانی است.",
//         note: "Also used metaphorically for progress over time.",
//       },
//     ],
//   },
//   careful: {
//     word: "careful",
//     meaning: "مراقب",
//     description:
//       "Used when someone avoids mistakes, danger, or damage by paying close attention.",
//     examples: [
//       {
//         example: "Be careful when crossing the street.",
//         translation: "هنگام عبور از خیابان مراقب باش.",
//       },
//       {
//         example: "He gave a careful answer to the question.",
//         translation: "او پاسخ دقیقی به سوال داد.",
//       },
//     ],
//   },
// };

// async function getPlaceholderVocabDetail (
//   word: string,
// ): Promise<VocabDetailViewModel> {
//   return (
//     placeholderDetails[word.toLowerCase()] ?? {
//       word,
//       meaning: "معنی نمونه",
//       description:
//         "This is placeholder detail data for the selected vocab until the real API is connected.",
//       examples: [
//         {
//           example: `This is a sample sentence using ${word}.`,
//           translation: `این یک جمله نمونه با کلمه ${word} است.`,
//         },
//         {
//           example: `This is a sample sentence using ${word}.`,
//           translation: `این یک جمله نمونه با کلمه ${word} است.`,
//         },
//         {
//           example: `This is a sample sentence using ${word}.`,
//           translation: `این یک جمله نمونه با کلمه ${word} است.`,
//         },
//         {
//           example: `This is a sample sentence using ${word}.`,
//           translation: `این یک جمله نمونه با کلمه ${word} است.`,
//         },
//       ],
//     }
//   );
// }

// function normalizeDetail (
//   detail: VocabDetailResponse | VocabDetailViewModel,
// ): VocabDetailViewModel {
//   if ("meaning" in detail) {
//     return detail;
//   }

//   return {
//     word: detail.word,
//     meaning: detail.translation ?? "No meaning available",
//     description: detail.description ?? "No description available",
//     examples: detail.translations.map((item) => ({
//       example: item.example,
//       translation: item.exampleTranslation,
//       note: item.description,
//     })),
//   };
// }

// export function VocabSwipeableDrawer ({
//   vocabs = placeholderWords,
//   getVocabDetail = getPlaceholderVocabDetail,
//   open,
//   selectedWord,
//   onClose,
//   hideTriggerList = false,
// }: Props) {
//   const [internalSelectedWord, setInternalSelectedWord] = useState<
//     string | null
//   >(null);
//   const [internalOpen, setInternalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [detail, setDetail] = useState<VocabDetailViewModel | null>(null);
//   const isOpen = open ?? internalOpen;

//   const activeWord = useMemo(
//     () => selectedWord ?? internalSelectedWord ?? vocabs[0]?.word ?? null,
//     [internalSelectedWord, selectedWord, vocabs],
//   );

//   useEffect(() => {
//     if (!isOpen || !activeWord) {
//       return;
//     }

//     let isMounted = true;

//     const loadDetail = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getVocabDetail(activeWord);

//         if (isMounted) {
//           setDetail(normalizeDetail(response));
//         }
//       } catch (error) {
//         console.error("Failed to load vocab detail:", error);

//         if (isMounted) {
//           setDetail(null);
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     void loadDetail();

//     return () => {
//       isMounted = false;
//     };
//   }, [activeWord, getVocabDetail, isOpen]);

//   const handleOpen = (word: string) => {
//     setInternalSelectedWord(word);
//     setInternalOpen(true);
//   };

//   const handleClose = () => {
//     onClose?.();
//     if (open == null) {
//       setInternalOpen(false);
//     }
//   };

//   return (
//     <>
//       {!hideTriggerList ? (
//         <Stack spacing={1.25}>
//           {vocabs.map((vocab) => (
//             <Card
//               key={vocab.id}
//               onClick={() => handleOpen(vocab.word)}
//               sx={{
//                 cursor: "pointer",
//                 borderRadius: 3,
//                 p: 1.5,
//                 border: "1px solid",
//                 borderColor: "divider",
//                 transition: "transform 180ms ease, box-shadow 180ms ease",
//                 "&:hover": {
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
//                 },
//               }}
//             >
//               <Stack
//                 direction="row"
//                 sx={{ alignItems: "center", justifyContent: "space-between" }}
//               >
//                 <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
//                   {vocab.word}
//                 </Typography>
//                 <Icon sx={{ color: "text.secondary" }}>chevron_right</Icon>
//               </Stack>
//             </Card>
//           ))}
//         </Stack>
//       ) : null}

//       <SwipeableDrawer
//         anchor="bottom"
//         open={isOpen}
//         onClose={handleClose}
//         onOpen={() => {
//           if (open == null) {
//             setInternalOpen(true);
//           }
//         }}
//         disableDiscovery={false}
//         slotProps={{
//           paper: {
//             sx: {
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               minHeight: "50vh",
//               maxHeight: "88vh",
//             },
//           },
//         }}
//       >
//         <Box sx={{ p: 3, pb: 4 }}>
//           <Box
//             sx={{
//               width: 56,
//               height: 6,
//               borderRadius: 999,
//               bgcolor: "action.selected",
//               mx: "auto",
//               mb: 2.5,
//             }}
//           />

//           {isLoading ? (
//             <Stack
//               sx={{ alignItems: "center", justifyContent: "center", py: 8 }}
//             >
//               <CircularProgress />
//             </Stack>
//           ) : detail ? (
//             <Stack spacing={2.5}>
//               <Stack
//                 direction="row"
//                 sx={{
//                   alignItems: "flex-start",
//                   justifyContent: "space-between",
//                   gap: 2,
//                 }}
//               >
//                 <Stack direction="row" spacing={1}>
//                   <IconButton
//                     aria-label="listen"
//                     sx={{
//                       border: "1px solid",
//                       borderColor: "divider",
//                       bgcolor: "background.paper",
//                     }}
//                   >
//                     <Icon>hearing</Icon>
//                   </IconButton>
//                   <IconButton
//                     aria-label="voice"
//                     sx={{
//                       border: "1px solid",
//                       borderColor: "divider",
//                       bgcolor: "background.paper",
//                     }}
//                   >
//                     <Icon>volume_up</Icon>
//                   </IconButton>
//                 </Stack>

//                 <Box sx={{ minWidth: 0 }}>
//                   <Typography
//                     variant="h2"
//                     sx={{ mb: 0.75, textAlign: "right", direction: "rtl" }}
//                   >
//                     {detail.word}
//                   </Typography>
//                   <Typography sx={{ color: "primary.main", mb: 1 }}>
//                     {detail.meaning}
//                   </Typography>
//                 </Box>
//               </Stack>

//               <Typography
//                 sx={{
//                   color: "text.secondary",
//                   lineHeight: 1.8,
//                   textAlign: "right",
//                   direction: "rtl",
//                 }}
//               >
//                 {detail.description}
//               </Typography>

//               <Divider />

//               <Box>
//                 <Typography sx={{ fontWeight: 800, mb: 1.5, direction: "rtl" }}>
//                   Examples
//                 </Typography>
//                 <Stack spacing={1.25}>
//                   {detail.examples.map((item, index) => (
//                     <Card
//                       key={`${detail.word}-${index}`}
//                       sx={{
//                         position: "relative",
//                         overflow: "hidden",
//                         p: 2,
//                         borderRadius: 4,
//                         border: "1px solid",
//                         borderColor: "divider",
//                         bgcolor: "background.paper",
//                         boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
//                         transition:
//                           "transform 180ms ease, box-shadow 180ms ease",
//                         "&::before": {
//                           content: "''",
//                           position: "absolute",
//                           insetBlockStart: 0,
//                           insetInlineStart: 0,
//                           insetInlineEnd: 0,
//                           height: 2,
//                           background:
//                             "linear-gradient(90deg, rgba(25,118,210,0.95) 0%, rgba(38,166,154,0.95) 100%)",
//                         },
//                         "&:hover": {
//                           transform: "translateY(-2px)",
//                           boxShadow: "0 18px 44px rgba(15, 23, 42, 0.12)",
//                         },
//                       }}
//                     >
//                       <Stack
//                         direction="row"
//                         sx={{
//                           alignItems: "flex-start",
//                           direction: "rtl",
//                           width: "100%",
//                         }}
//                       >
//                         <Stack
//                           spacing={1}
//                           sx={{
//                             minWidth: 0,
//                             flex: 1,
//                             textAlign: "right",
//                           }}
//                         >
//                           <Typography
//                             sx={{
//                               fontWeight: 600,
//                               lineHeight: 1.7,
//                               direction: "rtl",
//                               textAlign: "right",
//                               color: "text.primary",
//                             }}
//                           >
//                             {item.example}
//                           </Typography>
//                           <Typography
//                             sx={{
//                               color: "text.secondary",
//                               lineHeight: 1.8,
//                               direction: "ltr",
//                               textAlign: "left",
//                             }}
//                           >
//                             {item.translation}
//                           </Typography>
//                           {item.note ? (
//                             <Typography
//                               sx={{
//                                 color: "text.disabled",
//                                 fontSize: "0.82rem",
//                                 textAlign: "right",
//                                 direction: "rtl",
//                               }}
//                             >
//                               {item.note}
//                             </Typography>
//                           ) : null}
//                         </Stack>

//                         <IconButton
//                           aria-label="voice"
//                           sx={{
//                             flexShrink: 0,
//                             alignSelf: "center",
//                             width: 44,
//                             height: 44,
//                             p: 0,
//                             m: 0,
//                             marginRight: "auto",
//                             borderRadius: 3,
//                             border: "1px solid",
//                             borderColor: "divider",
//                             bgcolor: "grey.50",
//                             color: "primary.main",
//                             transition: "all 180ms ease",
//                             "&:hover": {
//                               bgcolor: "primary.main",
//                               color: "primary.contrastText",
//                               borderColor: "primary.main",
//                             },
//                           }}
//                         >
//                           <Icon>volume_up</Icon>
//                         </IconButton>
//                       </Stack>
//                     </Card>
//                   ))}
//                 </Stack>
//               </Box>
//             </Stack>
//           ) : (
//             <Typography sx={{ color: "error.main" }}>
//               Failed to load vocab detail.
//             </Typography>
//           )}
//         </Box>
//       </SwipeableDrawer>
//     </>
//   );
// }
