import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country_entry_names.dart';

part 'country_entry.g.dart';

/// Country Entry
@JsonSerializable(includeIfNull: false)
class ReferenceCountryEntry {
  const ReferenceCountryEntry({
    this.callingCode,
    required this.code,
    required this.countryId,
    this.currencyCode,
    this.isoAlpha2,
    this.isoAlpha3,
    required this.names,
  });
  final String? callingCode;
  final String code;
  final String countryId;
  final String? currencyCode;
  final String? isoAlpha2;
  final String? isoAlpha3;
  final List<ReferenceCountryEntryNames> names;

  factory ReferenceCountryEntry.fromJson(Map<String, dynamic> json) => _$ReferenceCountryEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryEntryToJson(this);
}
