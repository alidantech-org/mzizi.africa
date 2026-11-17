import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_entry.dart';

part 'institution_collection.g.dart';

/// Institution Collection
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionCollection {
  const GovernanceInstitutionCollection({required this.institutions});
  final List<GovernanceInstitutionEntry> institutions;

  factory GovernanceInstitutionCollection.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionCollectionToJson(this);
}
