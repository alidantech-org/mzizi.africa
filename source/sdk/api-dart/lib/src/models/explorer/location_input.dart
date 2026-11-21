import 'package:json_annotation/json_annotation.dart';

part 'location_input.g.dart';

/// Location Input
@JsonSerializable(includeIfNull: false)
class ExplorerLocationInput {
  const ExplorerLocationInput({required this.countryCode, this.find, this.kindCode, this.languageCode, this.limit, this.page, this.path});
  final String countryCode;
  final String? find;
  final String? kindCode;
  final String? languageCode;
  final int? limit;
  final int? page;
  final String? path;

  factory ExplorerLocationInput.fromJson(Map<String, dynamic> json) => _$ExplorerLocationInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerLocationInputToJson(this);
}
