import 'package:json_annotation/json_annotation.dart';

part 'office_detail_holders_names.g.dart';

/// Office Detail Holders Names
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailHoldersNames {
  const GovernanceOfficeDetailHoldersNames({required this.isPreferred, required this.name});
  final bool isPreferred;
  final String name;

  factory GovernanceOfficeDetailHoldersNames.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailHoldersNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailHoldersNamesToJson(this);
}
