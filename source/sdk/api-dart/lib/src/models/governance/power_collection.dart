import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/power_entry.dart';

part 'power_collection.g.dart';

/// Power Collection
@JsonSerializable(includeIfNull: false)
class GovernancePowerCollection {
  const GovernancePowerCollection({required this.powers});
  final List<GovernancePowerEntry> powers;

  factory GovernancePowerCollection.fromJson(Map<String, dynamic> json) => _$GovernancePowerCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePowerCollectionToJson(this);
}
