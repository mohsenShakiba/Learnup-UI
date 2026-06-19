export default function FormatNumber(x: number) {
    const int = Intl.NumberFormat('fa')
    return int.format(x);
}