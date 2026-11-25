import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_entry.dart';

part 'office_collection.g.dart';

/// Office Collection
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeCollection {
  const GovernanceOfficeCollection({required this.offices});
  final List<GovernanceOfficeEntry> offices;

  factory GovernanceOfficeCollection.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeCollectionToJson(this);
}
