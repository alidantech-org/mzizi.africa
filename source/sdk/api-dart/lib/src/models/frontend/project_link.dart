import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'project_link.g.dart';

/// Project Link
@JsonSerializable(includeIfNull: false)
class FrontendProjectLink {
  const FrontendProjectLink({required this.code, required this.name, this.status});
  final String code;
  final SharedLocalizedText name;
  final SharedLocalizedText? status;

  factory FrontendProjectLink.fromJson(Map<String, dynamic> json) => _$FrontendProjectLinkFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendProjectLinkToJson(this);
}
