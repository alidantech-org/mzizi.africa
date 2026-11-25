import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/currency_entry_names.dart';

part 'currency_entry.g.dart';

/// Currency Entry
@JsonSerializable(includeIfNull: false)
class ReferenceCurrencyEntry {
  const ReferenceCurrencyEntry({
    required this.code,
    required this.currencyId,
    this.isoCode,
    required this.minorUnits,
    required this.names,
    this.symbol,
  });
  final String code;
  final String currencyId;
  final String? isoCode;
  final int minorUnits;
  final List<ReferenceCurrencyEntryNames> names;
  final String? symbol;

  factory ReferenceCurrencyEntry.fromJson(Map<String, dynamic> json) => _$ReferenceCurrencyEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCurrencyEntryToJson(this);
}
