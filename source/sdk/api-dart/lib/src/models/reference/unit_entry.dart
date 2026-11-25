import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/unit_entry_names.dart';

part 'unit_entry.g.dart';

/// Unit Entry
@JsonSerializable(includeIfNull: false)
class ReferenceUnitEntry {
  const ReferenceUnitEntry({
    this.baseId,
    required this.code,
    required this.names,
    required this.quantityTerm,
    required this.symbol,
    required this.unitId,
  });
  final String? baseId;
  final String code;
  final List<ReferenceUnitEntryNames> names;
  final String quantityTerm;
  final String symbol;
  final String unitId;

  factory ReferenceUnitEntry.fromJson(Map<String, dynamic> json) => _$ReferenceUnitEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceUnitEntryToJson(this);
}
