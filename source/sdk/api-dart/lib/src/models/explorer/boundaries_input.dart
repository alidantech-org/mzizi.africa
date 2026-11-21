import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/explorer/boundary_mode.dart';

part 'boundaries_input.g.dart';

/// Boundaries Input
@JsonSerializable(includeIfNull: false)
class ExplorerBoundariesInput {
  const ExplorerBoundariesInput({required this.countryCode, this.languageCode, this.limit, this.mode, this.path, this.simplify});
  final String countryCode;
  final String? languageCode;
  final int? limit;
  final ExplorerBoundaryMode? mode;
  final String? path;
  final double? simplify;

  factory ExplorerBoundariesInput.fromJson(Map<String, dynamic> json) => _$ExplorerBoundariesInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerBoundariesInputToJson(this);
}
