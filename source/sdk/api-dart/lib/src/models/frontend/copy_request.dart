import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/language_choice.dart';

part 'copy_request.g.dart';

/// Copy Request
@JsonSerializable(includeIfNull: false)
class FrontendCopyRequest {
  const FrontendCopyRequest({required this.app, this.lang});
  final String app;
  final String? lang;

  factory FrontendCopyRequest.fromJson(Map<String, dynamic> json) => _$FrontendCopyRequestFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendCopyRequestToJson(this);
}
