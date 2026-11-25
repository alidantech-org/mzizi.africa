import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/language_choice.dart';

part 'home_request.g.dart';

/// Home Request
@JsonSerializable(includeIfNull: false)
class FrontendHomeRequest {
  const FrontendHomeRequest({this.host, this.lang});
  final String? host;
  final String? lang;

  factory FrontendHomeRequest.fromJson(Map<String, dynamic> json) => _$FrontendHomeRequestFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendHomeRequestToJson(this);
}
