import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'leader.g.dart';

/// Leader
@JsonSerializable(includeIfNull: false)
class FrontendLeader {
  const FrontendLeader({this.fromYear, required this.office, required this.officeName, this.person, this.personName});
  final int? fromYear;
  final String office;
  final SharedLocalizedText officeName;
  final String? person;
  final SharedLocalizedText? personName;

  factory FrontendLeader.fromJson(Map<String, dynamic> json) => _$FrontendLeaderFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendLeaderToJson(this);
}
