import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/power_entry_to_names.dart';

part 'power_entry.g.dart';

/// Power Entry
@JsonSerializable(includeIfNull: false)
class GovernancePowerEntry {
  const GovernancePowerEntry({
    required this.isBinding,
    required this.kindTerm,
    required this.powerId,
    this.provisionId,
    this.thresholdTerm,
    required this.toCode,
    required this.toId,
    required this.toNames,
  });
  final bool isBinding;
  final String kindTerm;
  final String powerId;
  final String? provisionId;
  final String? thresholdTerm;
  final String toCode;
  final String toId;
  final List<GovernancePowerEntryToNames> toNames;

  factory GovernancePowerEntry.fromJson(Map<String, dynamic> json) => _$GovernancePowerEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePowerEntryToJson(this);
}
